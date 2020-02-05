const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('../ml5.min.js');
const formatMessage = require('format-message');

const Message = {
    image_classification_model_url: {
        'ja': '画像分類モデルURL[URL]',
        'ja-Hira': 'がぞうぶんるいもでる[URL]',
        'en': 'image classification model URL [URL]'
    },
    classify_image: {
        'ja': '画像を分類する',
        'ja-Hira': 'がぞうをぶんるいする',
        'en': 'classify image'
    },
    image_label: {
        'ja': '画像ラベル',
        'ja-Hira': 'がぞうらべる',
        'en': 'image label'
    },
    when_received_block: {
        'ja': 'ラベル[LABEL]を受け取ったとき',
        'ja-Hira': 'ラベル[LABEL]をうけとったとき',
        'en': 'when received label:[LABEL]',
        'zh-cn': '接收到类别[LABEL]时'
    },
    label_block: {
        'ja': 'ラベル',
        'ja-Hira': 'ラベル',
        'en': 'label',
        'zh-cn': '标签'
    },
    any: {
        'ja': 'のどれか',
        'ja-Hira': 'のどれか',
        'en': 'any',
        'zh-cn': '任何'
    },
    all: {
        'ja': 'の全て',
        'ja-Hira': 'のすべて',
        'en': 'all',
        'zh-cn': '所有'
    },
    toggle_classification: {
        'ja': 'ラベル付けを[CLASSIFICATION_STATE]にする',
        'ja-Hira': 'ラベルづけを[CLASSIFICATION_STATE]にする',
        'en': 'turn classification [CLASSIFICATION_STATE]',
        'zh-cn': '[CLASSIFICATION_STATE]分类'
    },
    set_classification_interval: {
        'ja': 'ラベル付けを[CLASSIFICATION_INTERVAL]秒間に1回行う',
        'ja-Hira': 'ラベルづけを[CLASSIFICATION_INTERVAL]びょうかんに1かいおこなう',
        'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
        'zh-cn': '每隔[CLASSIFICATION_INTERVAL]秒标记一次'
    },
    video_toggle: {
        'ja': 'ビデオを[VIDEO_STATE]にする',
        'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
        'en': 'turn video [VIDEO_STATE]',
        'zh-cn': '[VIDEO_STATE]摄像头'
    },
    on: {
        'ja': '入',
        'ja-Hira': 'いり',
        'en': 'on',
        'zh-cn': '开启'
    },
    off: {
        'ja': '切',
        'ja-Hira': 'きり',
        'en': 'off',
        'zh-cn': '关闭'
    },
    video_on_flipped: {
        'ja': '左右反転',
        'ja-Hira': 'さゆうはんてん',
        'en': 'on flipped',
        'zh-cn': '镜像开启'
    }
};

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'zh-cn'];

class Scratch3TM2ScratchBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.locale = this.setLocale();

        this.video = document.createElement('video');
        this.video.width = 480;
        this.video.height = 360;
        this.video.autoplay = true;
        this.video.style.display = 'none';

        this.blockClickedAt = null;

        this.interval = 1000;
        this.minInterval = 100;

        const media = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        media.then(stream => {
            this.video.srcObject = stream;
        });

        this.timer = setInterval(() => {
            log.log('auto image classification started!');
            this.classifyVideoImage();
        }, this.minInterval);

        this.imageMetadata = null;
        this.imageClassifier = null;
        this.initImageProbableLabels();

        this.runtime.ioDevices.video.enableVideo();
    }

    initImageProbableLabels () {
        this.imageProbableLabels = [];
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: 'tm2scratch',
            name: 'TM2Scratch',
            blocks: [
                {
                    opcode: 'whenReceived',
                    text: Message.when_received_block[this.locale],
                    blockType: BlockType.HAT,
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            menu: 'received_menu',
                            defaultValue: Message.any[this.locale]
                        }
                    }
                },
                {
                    opcode: 'setImageClassificationModelURL',
                    text: Message.image_classification_model_url[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://teachablemachine.withgoogle.com/models/TuzkGLdX/'
                        }
                    }
                },
                {
                    opcode: 'classifyVideoImageBlock',
                    text: Message.classify_image[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'getImageLabel',
                    text: Message.image_label[this.locale],
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'toggleClassification',
                    text: Message.toggle_classification[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLASSIFICATION_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'classification_menu',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setClassificationInterval',
                    text: Message.set_classification_interval[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CLASSIFICATION_INTERVAL: {
                            type: ArgumentType.STRING,
                            menu: 'classification_interval_menu',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'videoToggle',
                    text: Message.video_toggle[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'video_menu',
                            defaultValue: 'off'
                        }
                    }
                }
            ],
            menus: {
                received_menu: 'getLabelsMenu',
                video_menu: this.getVideoMenu(),
                classification_interval_menu: this.getClassificationIntervalMenu(),
                classification_menu: this.getClassificationMenu()
            }
        };
    }

    whenReceived (args) {
        const label = this.getImageLabel();
        if (args.LABEL === Message.any[this.locale]) {
            return label !== '';
        }
        return label === args.LABEL;
    }

    /**
  * Set a model for image classification from URL.
  * @param {object} args - the block's arguments.
  * @property {string} URL - URL of model to be loaded.
  * @return {Promise} - A Promise that resolve after loaded.
  */
    setImageClassificationModelURL (args) {
        return this.loadImageClassificationModelFromURL(args.URL);
    }

    /**
   * Load a model from URL for image classification.
   * @param {string} url - URL of model to be loaded.
   * @return {Promise} - A Promise that resolves after loaded.
   */
    loadImageClassificationModelFromURL (url) {
        return new Promise(resolve => {
            fetch(`${url}metadata.json`)
                .then(res => res.json())
                .then(metadata => {
                    // TODO: timeStamp should be checked to decide update or not.
                    ml5.imageClassifier(`${url}model.json`)
                        .then(classifier => {
                            this.imageMetadata = metadata;
                            this.imageClassifier = classifier;
                            this.initImageProbableLabels();
                            log.info(`image model loaded from: ${url}`);
                        })
                        .catch(error => {
                            log.warn(error);
                        })
                        .finally(() => resolve());
                })
                .catch(error => {
                    log.warn(error);
                    resolve();
                });
        });
    }

    getLabelsMenu () {
        let menu = [Message.any[this.locale]];
        if (!this.imageMetadata) return menu;
        menu = menu.concat(this.imageMetadata.labels);
        return menu;
    }

    /**
   * Pick a probability which has highest confidence.
   * @param {Array} probabilities - An Array of probabilities.
   * @property {number} probabilities.confidence - Probability of the label.
   * @return {object} - One of the highest confidence probability.
   */
    getMostProbableOne (probabilities) {
        if (probabilities.length === 0) return null;
        let mostOne = probabilities[0];
        probabilities.forEach(clss => {
            if (clss.confidence > mostOne.confidence) {
                mostOne = clss;
            }
        });
        return mostOne;
    }

    /**
     * Classify image from the video input.
     * Call stack will wait until the previous classification was done.
     *
     * @param {object} _args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after classification.
     */
    classifyVideoImageBlock (_args, util) {
        if (this._isImageClassifying) {
            if (util) util.yield();
            return;
        }
        return this.classifyImage(this.video);
    }

    /**
   * Classyfy image from input data source.
   *
   * @param {HTMLImageElement | ImageData | HTMLCanvasElement | HTMLVideoElement} input
   *  - Data source for classification.
   * @return {Promise} - A Promise that resolves the result of classification.
   *  The result will be empty when the imageClassifier was not set.
   */
    classifyImage (input) {
        // Initialize probabilities to reset whenReceived blocks.
        this.initImageProbableLabels();
        if (!this.imageMetadata || !this.imageClassifier) {
            this._isImageClassifying = false;
            return Promise.resolve([]);
        }
        this._isImageClassifying = true;
        return this.imageClassifier.classify(input)
            .then(result => {
                // Yield some frames to evaluate whenReceive blocks.
                setTimeout(() => {
                    this.imageProbableLabels = result.slice();
                }, 1);
                return result;
            })
            .finally(() => {
                setTimeout(() => {
                    this._isImageClassifying = false;
                }, this.interval);
            });
    }

    /**
   * Get the most probable label in the image.
   * Retrun the last classification result or '' when the first classification was not done.
   * @return {string} label
   */
    getImageLabel () {
        if (!this.imageProbableLabels || this.imageProbableLabels.length === 0) return '';
        return this.getMostProbableOne(this.imageProbableLabels).label;
    }

    toggleClassification (args) {
        if (this.actionRepeated()) {
            return;
        }

        const state = args.CLASSIFICATION_STATE;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (state === 'on') {
            this.timer = setInterval(() => {
                this.classifyVideoImage();
            }, this.minInterval);
        }
    }

    setClassificationInterval (args) {
        if (this.actionRepeated()) {
            return;
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.interval = args.CLASSIFICATION_INTERVAL * 1000;
        this.timer = setInterval(() => {
            this.classifyVideoImage();
        }, this.minInterval);
    }

    videoToggle (args) {
        if (this.actionRepeated()) {
            return;
        }

        const state = args.VIDEO_STATE;
        if (state === 'off') {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            this.runtime.ioDevices.video.mirror = state === 'on';
        }
    }

    classifyVideoImage () {
        if (this._isImageClassifying) return Promise.reject('imageClassifier is busy');
        return this.classifyImage(this.video);
    }

    actionRepeated () {
        const currentTime = Date.now();
        if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
            log.log('Please do not repeat trigerring this block.');
            this.blockClickedAt = currentTime;
            return true;
        }
        this.blockClickedAt = currentTime;
        return false;
        
    }

    getVideoMenu () {
        return [
            {
                text: Message.off[this.locale],
                value: 'off'
            },
            {
                text: Message.on[this.locale],
                value: 'on'
            },
            {
                text: Message.video_on_flipped[this.locale],
                value: 'on-flipped'
            }
        ];
    }

    getClassificationIntervalMenu () {
        return [
            {
                text: '1',
                value: '1'
            },
            {
                text: '0.5',
                value: '0.5'
            },
            {
                text: '0.2',
                value: '0.2'
            },
            {
                text: '0.1',
                value: '0.1'
            }
        ];
    }

    getClassificationMenu () {
        return [
            {
                text: Message.off[this.locale],
                value: 'off'
            },
            {
                text: Message.on[this.locale],
                value: 'on'
            }
        ];
    }

    setLocale () {
        const locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
            return locale;
        }
        return 'en';
        
    }
}

module.exports = Scratch3TM2ScratchBlocks;
