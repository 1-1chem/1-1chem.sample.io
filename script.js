// script.js

// クイズデータ
const quizData = {
  1: [
      { name: "水素イオン", formula: "H+^" },
      { name: "ナトリウムイオン", formula: "Na+^" },
      { name: "塩化物イオン", formula: "Cl-^" },
      { name: "カルシウムイオン", formula: "Ca2^+^" },
      { name: "酸化物イオン", formula: "O2^-^" },
      { name: "アルミニウムイオン", formula: "Al3^+^" },
      { name: "カリウムイオン", formula: "K+^" },
      { name: "鉄(Ⅱ)イオン", formula: "Fe2^+^" },
      { name: "銅(Ⅱ)イオン", formula: "Cu2^+^" },
      { name: "銀イオン", formula: "Ag+^" },
        ],
  2: [
    { name: "マグネシウムイオン", formula: "Mg2^+^" },
    { name: "リチウムイオン", formula: "Li+^" },
    { name: "臭化物イオン", formula: "Br-^" },
    { name: "フッ化物イオン", formula: "F-^" },
    { name: "ヨウ化物イオン", formula: "I-^" },
    { name: "亜鉛イオン", formula: "Zn2^+^" },
    { name: "ニッケル(Ⅱ)イオン", formula: "Ni2^+^" },
    { name: "硫化物イオン", formula: "S2^-^" },
    { name: "ストロンチウムイオン", formula: "Sr2^+^" },
    { name: "バリウムイオン", formula: "Ba2^+^" },
        ],
  3: [
    { name: "鉛(Ⅱ)イオン", formula: "Pb2^+^" },
    { name: "鉄(Ⅲ)イオン", formula: "Fe3^+^" },
    { name: "水銀(Ⅱ)イオン", formula: "Hg2^+^" },
    { name: "マンガン(Ⅱ)イオン", formula: "Mn2^+^" },
    { name: "クロム(Ⅲ)イオン", formula: "Cr3^+^" },
    { name: "クロム(Ⅵ)イオン", formula: "Cr6^+^" },
    { name: "スズ(Ⅱ)イオン", formula: "Sn2^+^" },
    { name: "スズ(Ⅳ)イオン", formula: "Sn4^+^" },
    { name: "銅(Ⅰ)イオン", formula: "Cu+^" },
    { name: "水銀(Ⅰ)イオン", formula: "Hg2_2^+^" },
        ],
  4: [
    { name: "水酸化物イオン", formula: "OH-^" },
    { name: "アンモニウムイオン", formula: "NH4_+^" },
    { name: "硝酸イオン", formula: "NO3_-^" },
    { name: "シアン化物イオン", formula: "CN-^" },
    { name: "硫酸イオン", formula: "SO4_2^-^" },
    { name: "炭酸イオン", formula: "CO3_2^-^" },
    { name: "リン酸イオン", formula: "PO4_3^-^" },
    { name: "酢酸イオン", formula: "CH3_COO-^" },
    { name: "過マンガン酸イオン", formula: "MnO4_-^" },
    { name: "クロム酸イオン", formula: "CrO4_2^-^" },
    { name: "二クロム酸イオン", formula: "Cr2_O7_2^-^" },
        ],
};

// HTML要素
const levelSelect = document.getElementById("level-select");
const startQuizBtn = document.getElementById("start-quiz");
const quizArea = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit-answer");
const timerEl = document.getElementById("time-left");
const largeDisplay = document.getElementById("large-display");
const feedbackEl = document.getElementById("feedback");
const resultArea = document.getElementById("result");
const scoreEl = document.getElementById("score");
const accuracyEl = document.getElementById("accuracy");
const retryBtn = document.getElementById("retry");
const exitBtn = document.getElementById("exit");
const correctSound = document.getElementById('correctSound');//正解音
const wrongSound = document.getElementById('wrongSound');//不正解音
const uetukiSound = document.getElementById('uetukiSound');//上付き音
const sitatukiSound = document.getElementById('sitatukiSound');//下付き音

const formattedAnswer = document.getElementById("formatted-answer");//フォーマットされた解答
const nextButton = document.getElementById("next-button");//次へボタン
//const tukaikata = document.getElementById("tukai-kata");

// 状態管理
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let timer;
let remainingTime = 20;

// 開始ボタン
startQuizBtn.addEventListener("click", () => {
  currentLevel = parseInt(levelSelect.value, 10);
  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  remainingTime = 20;
  document.getElementById("menu").classList.add("hidden");
  quizArea.classList.remove("hidden");
  largeDisplay.classList.remove("hidden");
  showNextQuestion();
});

// クイズ表示
function showNextQuestion() {
  if (currentQuestionIndex >= quizData[currentLevel].length) {
      showResults();
      return;
  }

  const question = quizData[currentLevel][currentQuestionIndex];
  questionEl.innerHTML = `<span style="font-size: 2em; font-weight: bold;">${question.name}</span> の化学式は？`;
  answerInput.value = "";
  feedbackEl.textContent = "";
  remainingTime = 20;
  answerInput.focus();// フォーカスを移動
  updateTimer();

  clearInterval(timer);
  timer = setInterval(() => {
      remainingTime--;
      updateTimer();
      if (remainingTime <= 0) {
          clearInterval(timer);
          showFeedback(false);
          submitBtn.style.display = "none";// 提出ボタンを非表示
          nextbotn();
      }
  }, 1000);
}

// タイマー更新
function updateTimer() {
  timerEl.textContent = remainingTime;
}

// 入力イベントを処理する
answerInput.addEventListener("input", () => {
  // 入力された文字列を処理して表示
  const formatted = formatAnswer(answerInput.value);
  formattedAnswer.innerHTML = formatted;
});

// 音声の再生関数
function playSound(sound) {
  if (sound) {
      sound.volume = 1.0; // 音量を最大に設定
      sound.muted = false; // ミュート解除
      sound.play().catch(error => console.log("音声再生エラー:", error));
  }
}

// 提出
submitBtn.addEventListener("click", () => {
submitBtn.style.display = "none";// 提出ボタンを非表示
clearInterval(timer);
  const correctAnswer = quizData[currentLevel][currentQuestionIndex].formula;

  showFeedback(answerInput.value === correctAnswer);
nextbotn();
});

// フィードバック表示
function showFeedback(isCorrect) {
  if (isCorrect) {
      
      feedbackEl.textContent = `正解！ ${remainingTime} 点`;
      playSound(correctSound);
      score += remainingTime;
      correctCount++;
  } else {
      playSound(wrongSound);
      feedbackEl.textContent = `不正解。正解は ${quizData[currentLevel][currentQuestionIndex].formula} です。`;
  }
}

// 次へボタン処理
function nextbotn() {
  nextButton.style.display = "inline-block"; // 次へボタンを表示

  // イベントリスナーがすでに設定されていない場合のみ設定する
  if (!nextButton.hasAttribute("data-listener-set")) {
    // 次の問題に進む処理を定義
    const nextQuestion = () => {
      formattedAnswer.innerHTML = "";
      currentQuestionIndex++; // 次の問題に進む
      nextButton.style.display = "none"; // 次へボタンを非表示
      submitBtn.style.display = "inline-block"; // 提出ボタンを表示
      showNextQuestion(); // 次の問題を表示
    };

    // クリックイベントリスナーを追加
    nextButton.addEventListener("click", nextQuestion);

    // イベントリスナーが設定されたことを示す属性を追加
    nextButton.setAttribute("data-listener-set", "true");
  }
}


// 結果表示
function showResults() {
  quizArea.classList.add("hidden");
  resultArea.classList.remove("hidden");
  scoreEl.textContent = `総得点: ${score}`;
  accuracyEl.textContent = `正答率: ${((correctCount / quizData[currentLevel].length) * 100).toFixed(2)}%`;
}

// リトライ
retryBtn.addEventListener("click", () => {
  resultArea.classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
});

// 終了
exitBtn.addEventListener("click", () => {
  window.close();
});

// 解答をフォーマットする関数

function formatAnswer(value) {// 入力をフォーマットする関数
  let result = ""; // フォーマット後の文字列
  for (let i = 0; i < value.length; i++) {// 入力文字列を1文字ずつ処理
      if (value[i] === "^" && i > 0) {// ^の前の文字を上付きに
          playSound(uetukiSound);
          const lastChar = result.slice(-1); // 直前の文字を取得
          result = result.slice(0, -1) + `<sup>${lastChar}</sup>`;// 直前の文字を上付きに
      } else if (value[i] === "_" && i > 0) {// _の前の文字を下付きに
          playSound(sitatukiSound); 
          const lastChar = result.slice(-1); // 直前の文字を取得
          result = result.slice(0, -1) + `<sub>${lastChar}</sub>`;// 直前の文字を下付きに
      } else if (value[i] !== "^" && value[i] !== "_") {// 通常の文字はそのまま追加
          result += value[i];// 通常の文字はそのまま追加
      }
  }
  return result;// フォーマット後の文字列を返す
}

// ユーザーの最初の操作時に音を有効化
// document.addEventListener("click", () => {
//  playSound(correctSound);
//  playSound(wrongSound);
//  playSound(uetukiSound);
//  playSound(sitatukiSound);
// }, { once: true }); // 1回だけ実行
