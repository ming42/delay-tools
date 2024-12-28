# delay calculator

分享一些自用小工具，这是一个基于web的计算点声源之间延时的计算工具。

## 功能

- 计算多个点声源之间的延时
- 计算延时等效距离
- 计算总等效距离
- 支持动态添加声源对    

## 安装说明

### 使用 venv

1. 创建虚拟环境
```
python -m venv venv 
```
2. 激活虚拟环境
```
source venv/bin/activate
```
3. 安装依赖
```
pip install -r requirements.txt
```
4. 运行程序
```
python app.py
```

### 使用 conda

1. 创建环境
```
conda env create -f environment.yml
```
2. 激活环境
```
conda activate delay_calculator
```
3. 运行程序
```
python app.py
```

然后在浏览器中访问 http://localhost:5000

## 使用说明

1. 输入点声源距离
2. 系统自动计算延时
3. 可以通过"+"按钮添加更多声源对
4. 实时显示延时等效距离和总等效距离


## 注意事项

- 声速采用 343.213 m/s
- 所有距离单位为厘米 (cm)
- 所有延时单位为毫秒 (ms)

## 许可证

本项目采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可证。

这意味着您可以：
- 分享 — 在任何媒介以任何形式复制、发行本作品
- 演绎 — 修改、转换或以本作品为基础进行创作

惟须遵守下列条件：
- 署名 — 您必须给出适当的署名，提供指向本许可证的链接，同时标明是否（对原始作品）作了修改
- 非商业性使用 — 您不得将本作品用于商业目的

详细许可证条款请参见：https://creativecommons.org/licenses/by-nc/4.0/deed.zh

## 致谢

代码由Cursor辅助生成。