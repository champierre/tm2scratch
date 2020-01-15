#!/bin/sh

LF=$(printf '\\\012_')
LF=${LF%_}

mkdir -p node_modules/scratch-vm/src/extensions/scratch3_tm2scratch
wget -P node_modules/scratch-vm/src/extensions/scratch3_tm2scratch https://raw.githubusercontent.com/champierre/tm2scratch/master/scratch-vm/src/extensions/scratch3_tm2scratch/index.js
wget -P node_modules/scratch-vm/src/extensions/scratch3_tm2scratch https://unpkg.com/ml5@0.4.3/dist/ml5.min.js
mv node_modules/scratch-vm/src/extension-support/extension-manager.js node_modules/scratch-vm/src/extension-support/extension-manager.js_orig
sed -e "s|scratch3_gdx_for')$|scratch3_gdx_for'),${LF}    tm2scratch: () => require('../extensions/scratch3_tm2scratch')|g" node_modules/scratch-vm/src/extension-support/extension-manager.js_orig > node_modules/scratch-vm/src/extension-support/extension-manager.js

mkdir -p src/lib/libraries/extensions/tm2scratch
wget -P src/lib/libraries/extensions/tm2scratch https://raw.githubusercontent.com/champierre/tm2scratch/master/scratch-gui/src/lib/libraries/extensions/tm2scratch/tm2scratch.png
wget -P src/lib/libraries/extensions/tm2scratch https://raw.githubusercontent.com/champierre/tm2scratch/master/scratch-gui/src/lib/libraries/extensions/tm2scratch/tm2scratch-small.png
mv src/lib/libraries/extensions/index.jsx src/lib/libraries/extensions/index.jsx_orig
ML2SCRATCH="\
    {${LF}\
        name: 'ML2Scratch',${LF}\
        extensionId: 'tm2scratch',${LF}\
        collaborator: 'champierre',${LF}\
        iconURL: tm2scratchIconURL,${LF}\
        insetIconURL: tm2scratchInsetIconURL,${LF}\
        description: (${LF}\
            <FormattedMessage${LF}\
                defaultMessage='TM2Scratch Blocks.'${LF}\
                description='TM2Scratch Blocks'${LF}\
                id='gui.extension.tm2scratchblocks.description'${LF}\
            />${LF}\
        ),${LF}\
        featured: true,${LF}\
        disabled: false,${LF}\
        internetConnectionRequired: true,${LF}\
        bluetoothRequired: false,${LF}\
        helpLink: 'https://champierre.github.io/tm2scratch/'${LF}\
    },"
sed -e "s|^export default \[$|import tm2scratchIconURL from './tm2scratch/tm2scratch.png';${LF}import tm2scratchInsetIconURL from './tm2scratch/tm2scratch-small.png';${LF}${LF}export default [${LF}${ML2SCRATCH}|g" src/lib/libraries/extensions/index.jsx_orig > src/lib/libraries/extensions/index.jsx
