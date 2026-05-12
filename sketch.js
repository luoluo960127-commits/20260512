let capture;
let bodyPose; 
let poses = []; 

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像並處理錯誤
  capture = createCapture(VIDEO, (stream) => {
    console.log("攝影機已啟動");
  });
  capture.size(640, 480);
  capture.hide();

  // 確保 ml5 已載入才初始化
  if (typeof ml5 !== 'undefined') {
    bodyPose = ml5.bodyPose(capture, modelReady);
    bodyPose.on('pose', (results) => {
      poses = results;
    });
  } else {
    console.error("ml5.js 載入失敗，請檢查網路連線或 script 標籤");
  }
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

  // 繪製學號文字 (在影像上方的紫色背景區域，不隨影像鏡像)
  fill(0); // 設定文字顏色為黑色
  textSize(24); // 設定字體大小
  textAlign(CENTER, CENTER); // 設定文字水平與垂直皆置中
  text('教科414730217', width / 2, y / 2);

  // 確保攝影機已經有畫面資訊才開始繪製，避免除以 0 的錯誤
  if (!capture || capture.width === 0) return;

  push();
  // 處理左右顛倒（鏡像）：移動座標系到最右側，並將 X 軸翻轉
  translate(width, 0);
  scale(-1, 1);
  
  // 在鏡像後的座標系中繪製影像
  image(capture, x, y, w, h);

  // 繪製耳垂位置的黃色圓圈耳環
  if (Array.isArray(poses) && poses.length > 0) {
    let pose = poses[0]; 
    // 新版 ml5 的關鍵點名稱為 left_ear 和 right_ear
    if (pose.left_ear) drawEarring(pose.left_ear, x, y, w, h);
    if (pose.right_ear) drawEarring(pose.right_ear, x, y, w, h);
  }
  pop();
}

function drawEarring(ear, ox, oy, dw, dh) {
  // 確保耳朵點位存在且信心度足夠
  if (ear && ear.confidence > 0.2) {
    // 將相機原始座標映射到畫布上的實際顯示區域
    let mappedX = ox + (ear.x / capture.width) * dw;
    let mappedY = oy + (ear.y / capture.height) * dh;
    
    // 從耳部座標向下偏移一些，模擬耳垂位置
    let lobeY = mappedY + 15;

    fill(255, 255, 0); // 黃色
    noStroke();
    
    for (let i = 0; i < 3; i++) {
      circle(mappedX, lobeY + (i * 15), 10);
    }
  }
}
