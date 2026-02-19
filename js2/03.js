//  人数 N の入力を受け取る
const N = Number(window.prompt("何人分の点数を入力しますか？"));

// 点数を格納するための空の配列を用意する
let scoreList = []; 

// ループの中で N 回点数の入力を受け取る
for (let i = 0; i < N; i++) {
    const input = window.prompt(`${i + 1}人目の点数を入力してください`);
    const score = Number(input);
    scoreList.push(score); 
}

/**
 * 点数の配列を受け取り、成績の配列を返す関数
 * 配列の各要素を判定して新しい配列を作る map メソッドを使用
 */
function assignGrades(scores) {
    return scores.map(score => {
        if (score >= 80) return "A";
        if (score >= 60) return "B";
        if (score >= 40) return "C";
        if (score >= 20) return "D";
        return "E";
    });
}

// 関数を実行して結果を取得
const finalGrades = assignGrades(scoreList);

// 結果を表示
document.write("入力された点数: " + scoreList + "<br>");
document.write("成績の配列: " + finalGrades + "<br>");