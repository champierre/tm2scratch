## Request for support

TM2Scratch has been open source and free of charge since 2020, and is used in various places such as schools and various programming classes. In order to continue development, we need support from everyone who uses it.
I would be very grateful if you could support me in the form of [a cup of coffee]((https://www.buymeacoffee.com/champierre)).

<a href="https://www.buymeacoffee.com/champierre"><img src="https://user-images.githubusercontent.com/10215/215533679-bb41b1a2-ba42-4eb6-9f9a-6d0bd67f3aaa.png"></a>

# TM2Scratch

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

TM2Scratch connects Google Teachable Machine 2 with Scratch 3. You can use image, audio recognition on Scratch project(Please use [TMPose2Scratch](https://github.com/champierre/tmpose2scratch) for pose recognition).

## How to use

### Image recognition

1. On [Google Teachable Machine](https://teachablemachine.withgoogle.com/) website, create an image classification model and upload it.

2. Copy the sharable link.

  <img src="images/en/sharable_link.png" />

3. Open [https://stretch3.github.io/](https://stretch3.github.io/) on Chrome browser.

4. Open "Choose an Extension" window and select "TM2Scratch".

5. Paste the shareble link into the text field of "image classification model URL" block.

  <img src="images/en/load_image_model_url.png" />

6. You can use the image recognition results with "when received image label" blocks.

  <img src="images/en/when_received.png" />

### Audio recognition

1. On [Google Teachable Machine](https://teachablemachine.withgoogle.com/) website, create a sound classification model and upload it.

2. Copy the sharable link.

3. Open https://champierre.github.io/tm2scratch on Chrome browser.

4. Open "Choose an Extension" window and select "TM2Scratch".

5. Paste the shareble link into the text field of "sound classification model URL" block.

  <img src="images/en/load_sound_model_url.png" />

6. You can use the sound recognition results with "when received sound label" blocks.

  <img src="images/en/when_received_sound_label.png" />

7. **NOTE** The camera image that is trained on the Teachable Machine is a square, whereas the camera image that appears on the Scratch stage is a horizontal rectangle. Note that the horizontal edges of the camera image are ignored, and the image in the center is used to recognize. (This is not a problem as long as the object to be judged is in the center of the image.)

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

### Demo & Links

- TM2Scratch + micro:bit Extension

  <img src="images/rsp.gif" />
