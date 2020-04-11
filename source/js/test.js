window.onload = () => {
    new l2dViewer({
        el: document.getElementById('L2dCanvas'), // 要添加Live2d的元素
        basePath: '/hao', // 模型根目录
        modelName: 'hao', // 模型名称
        width: 500,
        height: 300
    })
}