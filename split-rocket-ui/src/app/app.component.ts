import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  showResult: boolean = false;
  showEmptyResult :boolean = false;

  balances: any[] = [];

  constructor(private _fb: FormBuilder,
    private appService: AppService) {}

  userForm = this._fb.group({
    tripName: ['', Validators.minLength(3)],
    memberCount: [''],
    members: this._fb.array([]),
  });

  destroy$: Subject<boolean> = new Subject<boolean>();



  ngOnInit() {

  }

  private memberObj(): FormGroup {
    return this._fb.group({
      name: ['', Validators.required],
      expense: this._fb.array([]),
    });
  }

  private expenseObj(): FormGroup {
    return this._fb.group({
      expenseTitle: ['', Validators.required],
      amount: ['', Validators.required, [Validators.maxLength(5), Validators.pattern("^[0-9]*$"),]],
    });
  }

  get membersArray(): FormArray {
    return <FormArray>this.userForm.get('members');
  }

  getExpenses(group: any) {
    return group.get('expense')['controls'];
  }

  createMembers(input: { value: any; }): void {
    const value = input.value;
    for (let i = 0; i < value; i++) {
      this.membersArray.push(this.memberObj());
      this.addExpense(i);
    }
  }

  addExpense(index: any): void {
    (<FormArray>(
      (<FormGroup>this.membersArray.controls[index]).controls['expense']
    )).push(this.expenseObj());
  }

  onSubmitForm(form: { value: any; }) {
    this.appService.calculateExpenses(form.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if(Array.isArray(data) && data.length > 0){
        this.showResult = true;
        this.balances = data
      } else {
        this.showResult = true;
        this.showEmptyResult = true;
      }
    });
  }

  reset(){
    this.userForm = this._fb.group({
      tripName: ['', Validators.minLength(3)],
      memberCount: [''],
      members: this._fb.array([]),
    });

    this.balances = [];
    this.showResult = false;
    this.showEmptyResult = false;
  }

  getBalanceContent(balance:any){
    return "*" + balance.from + " owes " + balance.to + " $" + balance.amount;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
