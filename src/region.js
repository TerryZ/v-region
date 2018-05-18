import d from './data';

let province = [], city = [], area = [];
// prepare data
for(let item in d){
    if(!(item % 1e4)){
        province.push({key: item, value: d[item]});
    }else if(!(item % 100)){
        city.push({key: item, value: d[item]});
    }else {
        area.push({key: item, value: d[item]});
    }
}

export {province as srcProvince};
export {city as srcCity};
export {area as srcArea};