ez-map-util
===========
> 支持 AMD UMD Winodw Require 等加载方式

> 地图工具类

> 各种坐标系之间的转换

> 2坐标之间的距离计算,提供各个网络地图的不同算法

> 判断坐标是否在某个区域下,目前只提供是否在中国境内

## Install
```
npm install ez-map-util --save
```
```
or
```
```
npm install ez-map-util --save-dev
```

## Example
### `gulpfile.js`
```js
// import
var mapUtil = require('ez-map-util');
// or
var mapUtil = window['mapUtil'];

// using... demo.html with vue.js

mapUtil.getLongDistanceBaidu(this.input1.lng1, this.input1.lat1, this.input1.lng2, this.input1.lat2);
mapUtil.getShortDistanceBaidu(this.input2.lng1, this.input2.lat1, this.input2.lng2, this.input2.lat2);
mapUtil.outOfChina(this.input3.lat1, this.input3.lng1);
mapUtil.bd09ToGcj02(this.input4.lng1, this.input4.lat1);
mapUtil.wgs84ToGcj02(this.input5.lng1, this.input5.lat1);
mapUtil.gcj02ToWgs84(this.input6.lng1, this.input6.lat1);
mapUtil.getDistanceGoogle(this.input7.lng1, this.input7.lat1, this.input7.lng2, this.input7.lat2);
mapUtil.getDistanceGoogle2(this.input8.lng1, this.input8.lat1, this.input8.lng2, this.input8.lat2);

```


### cdn(options)

### outOfChina

Type: `Function`
Args: lng , lat
Return: `Boolean`

判断坐标是否在中国境外,未验证.

#### getLongDistanceBaidu
Type: `Function`
Args: lng1, lat1, lng2, lat2
Return: `Number`

获取2点坐标之间的距离,百度算法,适用于`长距离`计算.

#### getShortDistanceBaidu
Type: `Function`
Args: lng1, lat1, lng2, lat2
Return: `Number`

获取2点坐标之间的距离,百度算法,适用于`短距离`计算.

#### getDistanceGoogle
Type: `Function`
Args: lng1, lat1, lng2, lat2
Return: `Number`

获取2点坐标之间的距离,谷歌算法1.

#### getDistanceGoogle2
Type: `Function`
Args: lng1, lat1, lng2, lat2
Return: `Number`

获取2点坐标之间的距离,谷歌算法2.

#### bd09ToGcj02
Type: `Function`
Args: lng , lat
Return: {bd_lng,bd_lat}

百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换, 即 `百度` 转 `谷歌、高德`

#### wgs84ToGcj02
Type: `Function`
Args: lng , lat
Return: {lng,lat}

WGS84 转 GCj02, 既 `GPS设备坐标` 转 `谷歌高德`

#### gcj02ToBd09
Type: `Function`
Args: lng , lat
Return: {bd_lng,bd_lat}

火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换, 即`谷歌、高德` 转 `百度`

#### gcj02ToWgs84
Type: `Function`
Args: lng , lat
Return: {lng,lat}

GCJ02 转 WGS84, 既 `谷歌高德` 转 `GPS设备坐标` 

