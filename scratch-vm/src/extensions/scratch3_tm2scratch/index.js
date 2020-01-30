const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('./ml5.min.js');
const formatMessage = require('format-message');

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
