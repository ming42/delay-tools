from flask import Flask, render_template, jsonify, request
import math

app = Flask(__name__)

SPEED_OF_SOUND = 343.213  # 声速 (m/s)，提升精度到0.001%

def calculate_delay(distance1, distance2):
    """计算延时"""
    return (distance1 - distance2) / (SPEED_OF_SOUND * 100) * 1000  # 转换为毫秒，距离单位转换为cm

def calculate_delay_distance(delay):
    """计算延时等效距离"""
    if delay is None or delay == 0:
        return 0.00
    return abs(delay * SPEED_OF_SOUND * 100 / 1000)  # 使用绝对值，因为延时等效距离总是正值

def calculate_total_distance(base_distance, delay_distance):
    """计算总等效距离"""
    if base_distance is None:
        return 0.00
    return float(base_distance) + float(delay_distance)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    sources = data.get('sources', {})
    result = {'sources': {}}
    
    # 找到基准参数（最大距离）
    max_distance = 0
    base_source = None
    
    # 首先找到距离最长的声源作为基准
    for source_num, values in sources.items():
        distance = values.get('distance', 0)
        if distance > max_distance:
            max_distance = distance
            base_source = source_num
    
    if not base_source:
        return jsonify(result)
    
    # 将基准声源的延时设为0
    base_distance = float(sources[base_source]['distance'])
    result['sources'][base_source] = {
        'delay': 0.00,
        'delay_distance': 0.00,
        'total_distance': base_distance
    }
    
    # 计算其他声源的延时和距离
    for source_num, values in sources.items():
        if source_num == base_source:
            continue
            
        result['sources'][source_num] = {}
        
        if values.get('distance'):
            # 有距离输入时的计算
            distance = float(values['distance'])
            delay = calculate_delay(base_distance, distance)
            delay_distance = calculate_delay_distance(delay)
            total_distance = calculate_total_distance(distance, delay_distance)
            
            result['sources'][source_num].update({
                'delay': delay,
                'delay_distance': delay_distance,
                'total_distance': total_distance,
                'distance': distance
            })
            
        elif values.get('delay'):
            # 有延时输入时的计算
            delay = float(values['delay'])
            delay_distance = calculate_delay_distance(delay)
            distance = base_distance - delay_distance  # 使用减法，因为延时是相对于基准的
            total_distance = calculate_total_distance(distance, delay_distance)
            
            result['sources'][source_num].update({
                'delay': delay,
                'delay_distance': delay_distance,
                'total_distance': total_distance,
                'distance': distance
            })

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True) 