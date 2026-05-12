let capture;
let bodyPose; // 儲存 bodyPose 模型
let poses = []; // 儲存偵測結果

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定攝影機基準解析度
  // 隱藏原始 HTML 影片元件，只顯示在畫布上
  capture.hide();

  // 初始化 BodyPose 影像辨識 (使用 ml5 v1.0 新 API)
  bodyPose = ml5.bodyPose(capture, modelReady);
  
  // 當偵測到人體姿勢時，將結果存入 poses 陣列
  bodyPose.on('pose', (results) => {
    poses = results;
  });
}

function modelReady() {
  console.log('影像辨識模型已就緒');
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算顯示影像的寬高（畫布的 50%）
  let w = width * 0.5;
  let h = height * 0.5;
  // 計算置中座標
  let x = (width - w) / 2;
  let y = (height - h) / 2;

  // 在影像上方的空間顯示文字
  fill(0); // 設定文字顏色為黑色
  textSize(24); // 設定字體大小
  textAlign(CENTER, CENTER); // 設定文字水平與垂直皆置中
  // 繪製文字，位置在畫布水平中央 (width / 2)，垂直位置在影像上方的空白處中央 (y / 2)
  text('教科414730217', width / 2, y / 2);

  // 確保攝影機已經有畫面資訊才開始繪製，避免除以 0 的錯誤
  if (!capture || capture.width === 0) return;

  push();
  // 處理左右顛倒（鏡像）：移動座標系到最右側，並將 X 軸翻轉
  translate(width, 0);
  scale(-1, 1);
  
  // 在鏡像後的座標系中繪製影像
  image(capture, x, y, w, h);

  // 如果有偵測到人體，繪製耳環
  if (poses.length > 0) {
    let pose = poses[0]; // 取得第一個人的資料
    // 注意：ml5 v1.0 使用 left_ear 和 right_ear
    drawEarring(pose.left_ear, x, y, w, h);
    drawEarring(pose.right_ear, x, y, w, h);
  }
  pop();
}

function drawEarring(ear, ox, oy, dw, dh) {
  // 確保耳朵點位存在且信心度足夠
  if (ear && ear.confidence > 0.2) {
    // 將攝影機座標映射到畫布上的顯示區域
    // ear.x 是相對於 capture 寬度 (640) 的位置
    let mappedX = ox + (ear.x / capture.width) * dw;
    let mappedY = oy + (ear.y / capture.height) * dh;
    
    // 往下偏移 20 像素來對準「耳垂」
    let lobeY = mappedY + 20;

    fill('#FEE440'); // 亮黃色
    noStroke();
    
    // 由耳垂位置往下繪製三個圓圈，圓圈間距 15 像素
    for (let i = 0; i < 3; i++) {
      circle(mappedX, lobeY + (i * 18), 12);
    }
  }
}
