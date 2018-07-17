'use strict';
// const calc = require('calculatorjs');


// // console.log(math.add(math.bignumber(0.1),math.bignumber(0.2)))

// console.log(calc('0.1+0.2'));

// setTimeout(async()=> {

// },)
// const sleep = time => new Promise(res => setTimeout(res, time));
const sleep = time => new Promise(res => setTimeout(res, time));

async function test1() {
  await sleep(1000);
  console.log(1);
}
async function test2() {
  await sleep(1000);
  console.log(1);
}
async function test3() {
  await sleep(1000);
  console.log(1);
}
async function test4() {
  await sleep(1000);
  console.log(1);
}
async function test5() {
  await sleep(1000);
  console.log(1);
}
test1();
test2();
test3();
test4();
test5();
