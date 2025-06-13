// 预设的记忆包裹数据
const memoryPackages = [
    {
        id: 1,
        name: "我的第一个记忆包裹",
        memories: [
            {
                text: "这是我的记忆",
                background: "https://source.unsplash.com/random/1920x1080/?nature"
            },
            {
                text: "美好的回忆",
                background: "https://source.unsplash.com/random/1920x1080/?city"
            },
            {
                text: "难忘的瞬间",
                background: "https://source.unsplash.com/random/1920x1080/?travel"
            }
        ]
    }
];

// DOM 元素
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const uploadBtn = document.getElementById('uploadBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const settingsBtn = document.getElementById('settingsBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const background = document.getElementById('background');
const memoryText = document.getElementById('memoryText');

// 当前状态
let currentPackageIndex = 0;
let currentMemoryIndex = 0;

// 记忆包裹相关功能
let memories = [];
const API_URL = 'http://localhost:3000/api';

// 加载记忆包裹
async function loadMemories() {
    try {
        const response = await fetch(`${API_URL}/memories`);
        memories = await response.json();
        updateMemoryDisplay();
    } catch (error) {
        console.error('加载记忆包裹失败:', error);
    }
}

// 保存记忆包裹
async function saveMemory(memoryData) {
    try {
        const formData = new FormData();
        formData.append('title', memoryData.title);
        formData.append('content', memoryData.content);
        if (memoryData.image) {
            formData.append('image', memoryData.image);
        }
        formData.append('userId', 'user1'); // 这里可以根据实际用户系统修改

        const response = await fetch(`${API_URL}/memories`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            await loadMemories();
            return true;
        }
        return false;
    } catch (error) {
        console.error('保存记忆包裹失败:', error);
        return false;
    }
}

// 更新记忆显示
function updateMemoryDisplay() {
    const memoryText = document.getElementById('memoryText');
    const background = document.getElementById('background');
    
    if (memories.length > 0) {
        const currentMemory = memories[currentMemoryIndex];
        memoryText.textContent = currentMemory.title;
        if (currentMemory.imageUrl) {
            background.style.backgroundImage = `url(${currentMemory.imageUrl})`;
        }
    }
}

// 修改上传按钮点击事件
document.getElementById('uploadBtn').addEventListener('click', async function() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = '创建记忆包裹';
    modalContent.innerHTML = `
        <form id="memoryForm" class="space-y-4">
            <input type="text" id="memoryTitle" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="标题" required>
            <textarea id="memoryContent" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="内容" rows="4" required></textarea>
            <input type="file" id="memoryImage" class="w-full" accept="image/*">
            <button type="submit" class="w-full px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3A80D2] transition-colors">
                保存
            </button>
        </form>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    document.getElementById('memoryForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const memoryData = {
            title: document.getElementById('memoryTitle').value,
            content: document.getElementById('memoryContent').value,
            image: document.getElementById('memoryImage').files[0]
        };
        
        const success = await saveMemory(memoryData);
        if (success) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
});

// 页面加载时获取记忆包裹
document.addEventListener('DOMContentLoaded', loadMemories);

// 初始化
function init() {
    // 设置初始背景和文字
    updateMemory();
    
    // 添加事件监听器
    document.addEventListener('click', handleMainClick);
    menuBtn.addEventListener('click', toggleMenu);
    uploadBtn.addEventListener('click', showUploadForm);
    favoritesBtn.addEventListener('click', showMemoryPackages);
    settingsBtn.addEventListener('click', showSettings);
    closeModal.addEventListener('click', hideModal);
    
    // 点击模态框背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// 更新记忆显示
function updateMemory() {
    const currentPackage = memoryPackages[currentPackageIndex];
    const memory = currentPackage.memories[currentMemoryIndex];
    memoryText.textContent = memory.text;
    
    // 如果有背景图片则使用，否则使用默认背景色
    if (memory.background) {
        background.style.backgroundImage = `url(${memory.background})`;
        background.style.backgroundColor = 'transparent';
    } else {
        background.style.backgroundImage = 'none';
        background.style.backgroundColor = '#4A90E2';
    }
    
    // 添加淡入效果
    memoryText.classList.add('fade-in');
    setTimeout(() => memoryText.classList.remove('fade-in'), 500);
}

// 处理主区域点击
function handleMainClick(e) {
    // 如果点击的是菜单按钮或侧边菜单，不切换记忆
    if (e.target.closest('#menuBtn') || e.target.closest('#sideMenu')) {
        return;
    }
    
    const currentPackage = memoryPackages[currentPackageIndex];
    // 切换到下一个记忆
    currentMemoryIndex = (currentMemoryIndex + 1) % currentPackage.memories.length;
    updateMemory();
}

// 切换菜单显示
function toggleMenu() {
    sideMenu.classList.toggle('-translate-x-full');
}

// 显示上传表单
function showUploadForm() {
    modalTitle.textContent = '创建记忆包裹';
    modalContent.innerHTML = `
        <form id="uploadForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">包裹名称</label>
                <input type="text" name="packageName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]" required maxlength="50">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">记忆碎片（每行一个，最多100行，每行最多100字）</label>
                <textarea name="memoryTexts" rows="10" maxlength="10100" placeholder="每行一个记忆碎片" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]" required></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">背景图片（可选，所有碎片共用）</label>
                <input type="file" name="backgroundImage" accept="image/*" class="mt-1 block w-full">
            </div>
            <button type="submit" class="w-full px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3A80D2] transition-colors">
                创建
            </button>
        </form>
    `;
    showModal();

    // 添加表单提交处理
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleFormSubmit);
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('packageName');
    const memoryTexts = formData.get('memoryTexts').split('\n').map(line => line.trim()).filter(line => line.length > 0).slice(0, 100);
    const backgroundFile = formData.get('backgroundImage');
    const memories = memoryTexts.map(text => ({
        text: text.slice(0, 100),
        background: backgroundFile && backgroundFile.size > 0 ? URL.createObjectURL(backgroundFile) : null
    }));
    const newPackage = {
        id: memoryPackages.length + 1,
        name,
        memories
    };
    memoryPackages.push(newPackage);
    hideModal();
    showMemoryPackages();
}

// 展示包裹详情，支持增删改查碎片
function showPackageDetail(index) {
    const pkg = memoryPackages[index];
    modalTitle.textContent = `包裹：${pkg.name}`;
    modalContent.innerHTML = `
        <div class="space-y-4">
            <ul id="memoryList" class="space-y-2">
                ${pkg.memories.map((m, i) => `
                    <li class="flex items-center space-x-2">
                        <input type="text" value="${m.text.replace(/"/g, '&quot;')}" maxlength="100" class="flex-1 border rounded px-2 py-1" data-index="${i}" />
                        <button class="text-red-500" onclick="deleteMemoryFragment(${index},${i})">删除</button>
                    </li>
                `).join('')}
            </ul>
            <button id="addFragmentBtn" class="px-3 py-1 bg-[#4A90E2] text-white rounded">添加碎片</button>
            <button id="saveFragmentsBtn" class="px-3 py-1 bg-green-500 text-white rounded">保存修改</button>
        </div>
    `;
    showModal();
    document.getElementById('addFragmentBtn').onclick = function() {
        if(pkg.memories.length >= 100) return alert('最多100条碎片');
        pkg.memories.push({text: '', background: pkg.memories[0]?.background || null});
        showPackageDetail(index);
    };
    document.getElementById('saveFragmentsBtn').onclick = function() {
        const inputs = modalContent.querySelectorAll('input[type="text"]');
        pkg.memories = Array.from(inputs).map(input => ({
            text: input.value.slice(0, 100),
            background: pkg.memories[0]?.background || null
        })).filter(m => m.text.length > 0);
        updateMemory();
        showPackageDetail(index);
    };
}

// 删除碎片
window.deleteMemoryFragment = function(pkgIndex, fragIndex) {
    const pkg = memoryPackages[pkgIndex];
    pkg.memories.splice(fragIndex, 1);
    showPackageDetail(pkgIndex);
}

// 修改包裹列表展示，增加"详情"按钮
function showMemoryPackages() {
    modalTitle.textContent = '记忆包裹';
    modalContent.innerHTML = `
        <div class="space-y-4">
            ${memoryPackages.map((pkg, index) => `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex justify-between items-center">
                        <h3 class="font-medium">${pkg.name}</h3>
                        <div class="space-x-2">
                            <button onclick="selectPackage(${index})" class="text-[#4A90E2] hover:text-[#3A80D2]">展示</button>
                            <button onclick="showPackageDetail(${index})" class="text-[#4A90E2] hover:text-[#3A80D2]">详情</button>
                            <button onclick="deletePackage(${index})" class="text-red-500 hover:text-red-600">删除</button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">包含 ${pkg.memories.length} 条记忆</p>
                </div>
            `).join('')}
        </div>
    `;
    showModal();
}

// 选择记忆包裹
function selectPackage(index) {
    currentPackageIndex = index;
    currentMemoryIndex = 0;
    updateMemory();
    hideModal();
    toggleMenu(); // 关闭侧边菜单
}

// 删除记忆包裹
function deletePackage(index) {
    if (confirm('确定要删除这个记忆包裹吗？')) {
        // 从包裹列表中移除
        memoryPackages.splice(index, 1);
        // 如果删除的是当前包裹，切换到第一个包裹
        if (currentPackageIndex === index) {
            currentPackageIndex = 0;
            currentMemoryIndex = 0;
            updateMemory();
        }
        showMemoryPackages(); // 刷新记忆包裹列表
    }
}

// 显示设置
function showSettings() {
    modalTitle.textContent = '设置';
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">主题颜色</label>
                <select id="themeColor" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]">
                    <option value="blue">蓝色</option>
                    <option value="green">绿色</option>
                    <option value="purple">紫色</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">字体大小</label>
                <input type="range" id="fontSize" min="12" max="24" value="16" class="mt-1 block w-full">
                <span id="fontSizeValue" class="text-sm text-gray-500">16px</span>
            </div>
            <div class="flex justify-end space-x-2">
                <button id="cancelSettings" class="px-4 py-2 text-gray-600 hover:text-gray-800">取消</button>
                <button id="saveSettings" class="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3A80D2] transition-colors">
                    保存
                </button>
            </div>
        </div>
    `;
    showModal();

    // 添加事件监听器
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValue = document.getElementById('fontSizeValue');
    const cancelBtn = document.getElementById('cancelSettings');
    const saveBtn = document.getElementById('saveSettings');

    // 更新字体大小显示
    fontSizeInput.addEventListener('input', () => {
        fontSizeValue.textContent = `${fontSizeInput.value}px`;
    });

    // 取消按钮
    cancelBtn.addEventListener('click', hideModal);

    // 保存按钮
    saveBtn.addEventListener('click', () => {
        const themeColor = document.getElementById('themeColor').value;
        const fontSize = fontSizeInput.value;

        // 应用设置
        document.body.className = `bg-[${themeColor}] font-['Inter']`;
        document.getElementById('memoryText').style.fontSize = `${fontSize}px`;

        // 保存到本地存储
        localStorage.setItem('themeColor', themeColor);
        localStorage.setItem('fontSize', fontSize);

        hideModal();
    });

    // 加载已保存的设置
    const savedThemeColor = localStorage.getItem('themeColor');
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedThemeColor) {
        document.getElementById('themeColor').value = savedThemeColor;
    }
    if (savedFontSize) {
        fontSizeInput.value = savedFontSize;
        fontSizeValue.textContent = `${savedFontSize}px`;
    }
}

// 显示模态框
function showModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// 隐藏模态框
function hideModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// 初始化应用
init(); 