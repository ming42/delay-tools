let sourceCount = 2; // 从2开始，因为0,1,2已经存在

// 为所有输入框添加实时计算功能
function setupInputListeners() {
    document.querySelectorAll('.distance-input').forEach(input => {
        input.addEventListener('input', debounce(calculateAll, 100));
    });
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 为所有添加按钮添加事件监听
function setupAddButtonListeners() {
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const sourceGroup = e.target.closest('.source-group');
            if (sourceGroup) {
                addSourcePair();
            }
        });
    });
}

function addSourcePair() {
    sourceCount += 2;
    const leftNum = sourceCount - 1;
    const rightNum = sourceCount;
    
    // 同时添加左右两侧的声源
    addSourceToSide('left', leftNum, rightNum);
    addSourceToSide('right', rightNum, leftNum);
    
    // 为新添加的元素设置监听器
    setupAddButtonListeners();
    setupInputListeners();
}

function createDistanceInfo() {
    return `
        <div class="equivalent-distance">
            <span>延时等效距离: </span>
            <span class="delay-equiv-value">0.00</span>
            <span> cm</span>
        </div>
        <div class="equivalent-distance">
            <span>总等效距离: </span>
            <span class="total-equiv-value">0.00</span>
            <span> cm</span>
        </div>
    `;
}

function addSourceToSide(side, number, pairedNumber) {
    const sourceGroup = document.createElement('div');
    sourceGroup.className = 'source-group';
    
    sourceGroup.innerHTML = `
        <div class="source-box">
            <div class="source-number">No.${number}</div>
            <div class="paired-source">配对: No.${pairedNumber}</div>
            <div class="input-group">
                <label>距离:</label>
                <input type="text" class="distance-input" data-source="${number}">
                <span>cm</span>
            </div>
            <div class="input-group">
                <label>延时:</label>
                <input type="text" class="delay-input" data-source="${number}" readonly>
                <span>ms</span>
            </div>
            <div class="distance-info">${createDistanceInfo()}</div>
        </div>
        <div class="source-point">${number}</div>
        <button class="add-button">+</button>
    `;
    
    document.querySelector(`.${side}-sources`).appendChild(sourceGroup);
}

function collectInputData() {
    const data = {
        sources: {}
    };
    
    // 收集所有声源的输入数据
    document.querySelectorAll('.source-box').forEach(box => {
        const sourceNumber = box.querySelector('.source-number').textContent.split('/')[0].replace('No.', '').trim();
        const distanceInput = box.querySelector('.distance-input');
        const delayInput = box.querySelector('.delay-input');
        
        // 只收集有值的输入，忽略空值和正在编辑的值
        const distance = distanceInput?.value.trim();
        const delay = delayInput?.value.trim();
        
        // 只有当输入框有实际值时才收集数据
        if (distance !== '') {
            data.sources[sourceNumber] = {
                distance: parseFloat(distance)
            };
        } else if (delay !== '') {
            data.sources[sourceNumber] = {
                delay: parseFloat(delay)
            };
        }
    });
    
    return data;
}

function updateResults(result) {
    // 更新每个声源的计算结果
    Object.entries(result.sources || {}).forEach(([sourceNumber, values]) => {
        // 使用更精确的选择器并添加错误检查
        const sourceBox = document.querySelector(`.source-box:has([data-source="${sourceNumber}"])`);
        if (!sourceBox) {
            console.warn(`未找到声源 ${sourceNumber} 的元素`);
            return; // 跳过这个声源的更新
        }

        const distanceInput = sourceBox.querySelector('.distance-input');
        const delayInput = sourceBox.querySelector('.delay-input');
        const delayEquivValue = sourceBox.querySelector('.delay-equiv-value');
        const totalEquivValue = sourceBox.querySelector('.total-equiv-value');
        
        // 检查每个元素是否存在后再更新
        if (distanceInput && values.distance !== undefined && distanceInput.value.trim() === '') {
            distanceInput.value = values.distance.toFixed(2);
        }
        
        if (delayInput && values.delay !== undefined) {
            delayInput.value = values.delay.toFixed(2);
        }
        
        if (delayEquivValue && values.delay_distance !== undefined) {
            delayEquivValue.textContent = values.delay_distance.toFixed(2);
        }
        
        if (totalEquivValue && values.total_distance !== undefined) {
            totalEquivValue.textContent = values.total_distance.toFixed(2);
        }
    });
}

async function calculateAll() {
    const data = collectInputData();
    if (Object.keys(data.sources).length === 0) {
        console.log('没有输入数据，跳过计算');
        return;
    }
    
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        updateResults(result);
    } catch (error) {
        console.error('计算出错:', error);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.distance-info').forEach(div => {
        div.innerHTML = createDistanceInfo();
    });
    setupAddButtonListeners();
    setupInputListeners();
}); 