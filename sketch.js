let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏原始 HTML 影片元件，只顯示在畫布上
  capture.hide();
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

  push();
  // 處理左右顛倒（鏡像）：移動座標系到最右側，並將 X 軸翻轉
  translate(width, 0);
  scale(-1, 1);
  
  // 在鏡像後的座標系中繪製影像
  image(capture, x, y, w, h);

  // 如果有偵測到人體
  if (poses.length > 0) {
    let pose = poses[0]; // 新版 ml5 直接回傳特徵點，不再嵌套在 .pose 屬性下
    // 繪製左右耳垂的耳環
    drawEarring(pose.left_ear, x, y, w, h);  // 新版屬性名為下底線 left_ear
    drawEarring(pose.right_ear, x, y, w, h); // 新版屬性名為下底線 right_ear
  }
  pop();
}

function drawEarring(ear, ox, oy, dw, dh) {
  // 確保偵測信賴度足夠
  if (ear.confidence > 0.2) {
    // 將攝影機座標映射到畫布上的顯示區域
    let mappedX = ox + (ear.x / capture.width) * dw;
    let mappedY = oy + (ear.y / capture.height) * dh;
    
    // 往下偏移一點點，模擬耳垂位置
    let lobeY = mappedY + 15;

    fill(255, 255, 0); // 黃色
    noStroke();
    // 由耳垂位置往下繪製三個圓圈
    for (let i = 0; i < 3; i++) {
      circle(mappedX, lobeY + (i * 15), 10);
    }
  }
}
