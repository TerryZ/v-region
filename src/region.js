/**
 * 数据自定义记录
 *
 * 2018.11.25
 * 修改 town/350112.json 文件名为 town/350112.json(原长乐县编码为350182，修改为长乐区后编码为350112)
 */
import d from './data';

let province = [], city = [], area = [];
// prepare data
for(let item in d){
    if(!(item % 1e4)){
        province.push({key: item, value: d[item]});
    }else if(!(item % 100)){
        city.push({key: item, value: d[item]});
    }else {
        let num = Number(String(item).substr(2));
        if(num > 9000) city.push({key: item, value: d[item]});
        else area.push({key: item, value: d[item]});
    }
}

export {province as srcProvince};
export {city as srcCity};
export {area as srcArea};