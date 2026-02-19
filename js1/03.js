const N = Number(window.prompt("自然数を入力してください"));

/* 1からNまでの「偶数の和」(evenSum) と 
  「奇数の和」(oddSum) */

  let evenSum = 0;
  let oddSum = 0;

/* ループを作成し、順番iが偶数なら(i%2 === 0　)ならevenSumにiを加える*/
for (let i = 1; i <= N; i++){
    if(i%2 === 0){
        evenSum += i;
    }   else {
        oddSum += i;
    }
}


/* ２つの差分を表示
  evenSumとoddSumの差分の絶対値を出力,絶対値はMath.abs()
  出力にはdocument.write()
*/
const difference = Math.abs(evenSum - oddSum);
document.write("偶数の和: " + evenSum + "<br>");
document.write("奇数の和: " + oddSum + "<br>"); 
document.write("偶数の和と奇数の和の差分: " + difference);