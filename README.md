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
var cdn = require('ez-html-replace');
var cdnUrl = '//www.baidu.com/cnd/';

gulp.task('cdn', function() {
    gulp.src('./example/*.html')
        .pipe(cdn({
            forcePrefix: 'config',
            root: {
                js: cdnUrl,
                css: cdnUrl
            },
            debug: false
        })).pipe(gulp.dest('./example/output/'))
});
```

### `demo.html -- before build`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>source template</title>
    <link rel="stylesheet" href="/css/sytle1.css"/>
    <link href="css/sytle1.css"/>
    <link href="../style/sytle2.css"/>
    <link href="../../sytle1.css"/>
    <script main="index.js" src="../config.js"></script>
    <script src="../../index.js"></script>
    <script src="index.js"></script>
    <script type="text/javascript" src="./main.js"></script>
    <script type="text/javascript" src="//www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="http://www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="https://www.baidu.com/js/main.js"></script>
</head>
<body>

</body>
</html>
```

### `demo.html -- after build`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>source template</title>
    <link rel="stylesheet" href="//www.baidu.com/cnd/config/css/sytle1.css"/>
    <link href="//www.baidu.com/cnd/config/example/css/sytle1.css"/>
    <link href="//www.baidu.com/cnd/config/style/sytle2.css"/>
    <link href="//www.baidu.com/cnd/config//usr/local/workspace/sytle1.css"/>
    <script main="index.js" src="//www.baidu.com/cnd/config/config.js"></script>
    <script src="//www.baidu.com/cnd/config//usr/local/workspace/index.js"></script>
    <script src="//www.baidu.com/cnd/config/example/index.js"></script>
    <script type="text/javascript" src="//www.baidu.com/cnd/config/example/main.js"></script>
    <script type="text/javascript" src="//www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="http://www.baidu.com/js/main.js"></script>
    <script type="text/javascript" src="https://www.baidu.com/js/main.js"></script>
</head>
<body>

</body>
</html>
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

