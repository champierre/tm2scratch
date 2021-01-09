# TM2Scratch

*他の言語で読む: [English](README.md), [日本語](README.ja.md).*

TM2Scratchは、Google Teachable Machine2で作成した機械学習モデルをScratch3で利用できるようにした拡張機能です。Scratchプロジェクトで画像、音声認識を使用できます（ポーズ認識については[TMPose2Scratch](https://github.com/champierre/tmpose2scratch)をご利用ください）。

## 使い方

### 画像認識

1. [Google Teachable Machine](https://teachablemachine.withgoogle.com/)で、画像分類モデルを作成してアップロードします。

2. アップロードしたモデルの共有リンクをコピーします。

  <img src="images/ja/sharable_link.png" />

3. Chromeブラウザで [https://stretch3.github.io/](https://stretch3.github.io/) を開きます。

4. 「拡張機能の選択」ウィンドウを開き、「TM2Scratch」を選択します。

5. 2.でコピーしたリンクを「画像分類モデルURL」ブロックのテキストフィールドに貼り付けます。

  <img src="images/ja/load_image_model_url.png" />

6. 「画像ラベル○○を受け取ったとき」ブロックで画像認識結果を使用できます。

  <img src="images/ja/when_received.png" />

### 音声認識

1. [Google Teachable Machine](https://teachablemachine.withgoogle.com/)で、音声分類モデルを作成してアップロードします。

2. アップロードしたモデルの共有リンクをコピーします。

3. Chromeブラウザで [https://stretch3.github.io/](https://stretch3.github.io/) を開きます。

4. 「拡張機能の選択」ウィンドウを開き、「TM2Scratch」を選択します。

5. 2.でコピーしたリンクを「音声分類モデルURL」ブロックのテキストフィールドに貼り付けます。

  <img src="images/ja/load_sound_model_url.png" />

6. 「音声ラベル○○を受け取ったとき」ブロックで音声認識結果を使用できます。

  <img src="images/ja/when_received_sound_label.png" />

## For Developers - How to run TM2Scratch extension on your computer

1. Setup LLK/scratch-gui on your computer.

    ```
    % git clone git@github.com:LLK/scratch-gui.git
    % cd scratch-gui
    % npm install
    ```

2. In scratch-gui folder, clone TM2Scratch. You will have tm2scratch folder under scratch-gui.

    ```
    % git clone git@github.com:champierre/tm2scratch.git
    ```

3. Run the install script.

    ```
    % sh tm2scratch/install.sh
    ```

4. Run Scratch, then go to http://localhost:8601/.

    ```
    % npm start
    ```
