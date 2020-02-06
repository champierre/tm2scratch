const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('../ml5.min.js');
const formatMessage = require('format-message');
const blockIconURI = 'data:image/png;base64,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';

const HAT_TIMEOUT = 100;

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
        this.when_received = false;
        this.when_received_arr = Array(8).fill(false);
        this.label = null;
        this.locale = this.setLocale();

        this.video = document.createElement('video');
        this.video.width = 480;
        this.video.height = 360;
        this.video.autoplay = true;
        this.video.style.display = 'none';

        this.blockClickedAt = null;

        this.interval = 1000;

        const media = navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        media.then(stream => {
            this.video.srcObject = stream;
        });

        this.knnClassifier = ml5.KNNClassifier();
        this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
            log.log('[featureExtractor] Model Loaded!');
            this.timer = setInterval(() => {
                this.classify();
            }, this.interval);
        });

        this.imageMetadata = null;
        this.imageClassifier = null;
        this.imageProbableLabels = [];

        this.runtime.ioDevices.video.enableVideo();
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: 'tm2scratch',
            name: 'TM2Scratch',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'getLabel',
                    text: Message.label_block[this.locale],
                    blockType: BlockType.REPORTER
                },
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
                    opcode: 'classifyVideoImage',
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

    getLabel () {
        return this.label;
    }

    whenReceived (args) {
        if (args.LABEL === 'any') {
            if (this.when_received) {
                setTimeout(() => {
                    this.when_received = false;
                }, HAT_TIMEOUT);
                return true;
            }
            return false;
        }
        if (this.when_received_arr[args.LABEL]) {
            setTimeout(() => {
                this.when_received_arr[args.LABEL] = false;
            }, HAT_TIMEOUT);
            return true;
        }
        return false;

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
                            this.imageProbableLabels = [];
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
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {Promise} - a Promise that resolves after classification.
     */
    classifyVideoImage (_args, util) {
        if (this._isImageClassifying) {
            if (util) util.yield();
            return;
        }
        this._isImageClassifying = true;
        return new Promise((resolve, reject) => {
            this.classifyImage(this.video)
                .then(result => {
                    this.imageProbableLabels = result;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                })
                .finally(() => {
                    this._isImageClassifying = false;
                });
        });
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
        if (!this.imageMetadata || !this.imageClassifier) {
            return Promise.resolve([]);
        }
        return this.imageClassifier.classify(input);
    }

    /**
   * Get the most probable label in the image.
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
                this.classify();
            }, this.interval);
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
            this.classify();
        }, this.interval);
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

    classify () {
        const numLabels = this.knnClassifier.getNumLabels();
        if (numLabels === 0) return;

        const features = this.featureExtractor.infer(this.video);
        this.knnClassifier.classify(features, (err, result) => {
            if (err) {
                log.error(err);
            } else {
                this.label = result.label;
                this.when_received = true;
                this.when_received_arr[result.label] = true;
            }
        });
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
