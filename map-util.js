/**
 * 地图工具
 * 代码来源网络收集
 * WGS84坐标系：即地球坐标系，国际上通用的坐标系。
 * GCJ02坐标系：即火星坐标系，WGS84坐标系经加密后的坐标系。
 * BD09坐标系：即百度坐标系，GCJ02坐标系经加密后的坐标系。
 * 搜狗坐标系、图吧坐标系等，估计也是在GCJ02基础上加密而成的。
 */

/**
 * 各个地图API采用的坐标系
 *  API                  坐标系
 *  百度地图API          百度坐标
 *  腾讯搜搜地图API      火星坐标
 *  搜狐搜狗地图API      搜狗坐标*
 *  阿里云地图API        火星坐标
 *  图吧MapBar地图API    图吧坐标
 *  高德MapABC地图API    火星坐标
 *  灵图51ditu地图API    火星坐标
 */
(
    function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define([], factory);
        } else if (typeof module === 'object' && module.exports) {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like environments that support module.exports,
            // like Node.
            module.exports = factory();
        } else {
            // Browser globals (root is window)
            root.mapUtil = factory();
        }
    }
)(this, function () {
    "use strict";
    var DEF_PI = 3.14159265359; // PI
    var DEF_2PI = 6.28318530712; // 2*PI
    var DEF_X_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var DEF_PI180 = 0.01745329252; // PI/180.0
    var DEF_EE = 0.00669342162296594323;
    var DEF_R = {
        'BAIDU': 6370693.5,
        'GOOGLE': 6378137
    }; // radius of earth baidu
    var DEF_A = 6378245.0;
    //lat:39.929658
    //lon:116.395504

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {lng,lat}
     */
    var bd09ToGcj02 = function bd09ToGcj02 (bd_lon, bd_lat) {
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * DEF_X_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * DEF_X_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return {
            lng: gg_lng,
            lat: gg_lat
        };
    };

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {lng,lat}
     */
    var gcj02ToBd09 = function gcj02ToBd09 (lng, lat) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * DEF_X_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * DEF_X_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {
            lng: bd_lng,
            lat: bd_lat
        };
    };

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var wgs84ToGcj02 = function wgs84ToGcj02 (lng, lat) {
        if (outOfChina(lng, lat)) {
            return {
                lng: lng,
                lat: lat
            }
        } else {
            var dlat = transformLat(lng - 105.0, lat - 35.0);
            var dlng = transformLng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * DEF_PI;
            var magic = Math.sin(radlat);
            magic = 1 - DEF_EE * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (
                       dlat * 180.0
                   ) / (
                       (
                           DEF_A * (
                               1 - DEF_EE
                           )
                       ) / (
                           magic * sqrtmagic
                       ) * DEF_PI
                   );
            dlng = (
                       dlng * 180.0
                   ) / (
                       DEF_A / sqrtmagic * Math.cos(radlat) * DEF_PI
                   );
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return {
                lng: mglng,
                lat: mglat
            }
        }
    };

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {lng,lat}
     */
    var gcj02ToWgs84 = function gcj02ToWgs84 (lng, lat) {
        if (outOfChina(lng, lat)) {
            return {
                lng: lng,
                lat: lat
            }
        } else {
            var dlat = transformLat(lng - 105.0, lat - 35.0);
            var dlng = transformLng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * DEF_PI;
            var magic = Math.sin(radlat);
            magic = 1 - DEF_EE * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (
                       dlat * 180.0
                   ) / (
                       (
                           DEF_A * (
                               1 - DEF_EE
                           )
                       ) / (
                           magic * sqrtmagic
                       ) * DEF_PI
                   );
            dlng = (
                       dlng * 180.0
                   ) / (
                       DEF_A / sqrtmagic * Math.cos(radlat) * DEF_PI
                   );
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return {
                lng: lng * 2 - mglng,
                lat: lat * 2 - mglat
            }
        }
    };

    var transformLat = function transformLat (lng, lat) {
        var ret = -100.0
                  + 2.0
                    * lng
                  + 3.0
                    * lat
                  + 0.2
                    * lat
                    * lat
                  + 0.1
                    * lng
                    * lat
                  + 0.2
                    * Math.sqrt(Math.abs(lng));
        ret += (
                   20.0 * Math.sin(6.0 * lng * DEF_PI) + 20.0 * Math.sin(2.0 * lng * DEF_PI)
               ) * 2.0 / 3.0;
        ret += (
                   20.0 * Math.sin(lat * DEF_PI) + 40.0 * Math.sin(lat / 3.0 * DEF_PI)
               ) * 2.0 / 3.0;
        ret += (
                   160.0 * Math.sin(lat / 12.0 * DEF_PI) + 320 * Math.sin(lat * DEF_PI / 30.0)
               ) * 2.0 / 3.0;
        return ret
    };

    var transformLng = function transformLng (lng, lat) {
        var ret = 300.0
                  + lng
                  + 2.0
                    * lat
                  + 0.1
                    * lng
                    * lng
                  + 0.1
                    * lng
                    * lat
                  + 0.1
                    * Math.sqrt(Math.abs(lng));
        ret += (
                   20.0 * Math.sin(6.0 * lng * DEF_PI) + 20.0 * Math.sin(2.0 * lng * DEF_PI)
               ) * 2.0 / 3.0;
        ret += (
                   20.0 * Math.sin(lng * DEF_PI) + 40.0 * Math.sin(lng / 3.0 * DEF_PI)
               ) * 2.0 / 3.0;
        ret += (
                   150.0 * Math.sin(lng / 12.0 * DEF_PI) + 300.0 * Math.sin(lng / 30.0 * DEF_PI)
               ) * 2.0 / 3.0;
        return ret
    };

    /**
     * 计算2点坐标距离,google算法1
     * @param lng1
     * @param lat1
     * @param lng2
     * @param lat2
     * @returns d
     */
    var getDistanceGoogle = function getDistanceGoogle (lng1, lat1, lng2, lat2) {
        console.log('getDistanceGoogle');
        var a, b, R;
        R = DEF_R['GOOGLE']; // 地球半径
        lat1 = lat1 * Math.PI / 180.0;
        lat2 = lat2 * Math.PI / 180.0;
        a = lat1 - lat2;
        b = (
                lng1 - lng2
            ) * Math.PI / 180.0;
        var d;
        var sa2, sb2;
        sa2 = Math.sin(a / 2.0);
        sb2 = Math.sin(b / 2.0);
        d = 2
            * R
            * Math.asin(Math.sqrt(sa2 * sa2 + Math.cos(lat1)
                                              * Math.cos(lat2) * sb2 * sb2));
        return d;
    };

    /**
     * 计算2点坐标距离,google算法2
     * @param lng1
     * @param lat1
     * @param lng2
     * @param lat2
     * @returns d
     */
    var getDistanceGoogle2 = function getDistanceGoogle2 (lng1, lat1, lng2, lat2) {
        console.log('getDistanceGoogle2');
        var lat = [lat1, lat2];
        var lng = [lng1, lng2];
        var R = DEF_R['GOOGLE'];
        var dLat = (
                       lat[1] - lat[0]
                   ) * Math.PI / 180;
        var dLng = (
                       lng[1] - lng[0]
                   ) * Math.PI / 180;
        var a = Math.sin(dLat / 2)
                * Math.sin(dLat / 2)
                + Math.cos(lat[0] * Math.PI / 180)
                  * Math.cos(lat[1] * Math.PI / 180)
                  * Math.sin(dLng / 2)
                  * Math.sin(dLng / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };

    /**
     * 计算2点坐标距离,百度算法,适用于近距离
     * @param lng1
     * @param lat1
     * @param lng2
     * @param lat2
     * @returns distance
     */
    var getShortDistanceBaidu = function getShortDistanceBaidu (lng1, lat1, lng2, lat2) {
        console.log('getShortDistanceBaidu');
        var ew1, ns1, ew2, ns2;
        var dx, dy, dew;
        var distance;
        // 角度转换为弧度
        ew1 = lng1 * DEF_PI180;
        ns1 = lat1 * DEF_PI180;
        ew2 = lng2 * DEF_PI180;
        ns2 = lat2 * DEF_PI180;
        // 经度差
        dew = ew1 - ew2;
        // 若跨东经和西经180 度，进行调整
        if (dew > DEF_PI) {
            dew = DEF_2PI - dew;
        } else if (dew < -DEF_PI) {
            dew = DEF_2PI + dew;
        }
        dx = DEF_R['BAIDU'] * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
        dy = DEF_R['BAIDU'] * (
                ns1 - ns2
            ); // 南北方向长度(在经度圈上的投影长度)
        // 勾股定理求斜边长
        distance = Math.sqrt(dx * dx + dy * dy);
        return distance;
    };

    /**
     * 计算2点坐标距离,百度算法,适用于远距离
     * @param lng1
     * @param lat1
     * @param lng2
     * @param lat2
     * @returns distance
     */
    var getLongDistanceBaidu = function getLongDistanceBaidu (lng1, lat1, lng2, lat2) {
        console.log('getLongDistanceBaidu');
        var ew1, ns1, ew2, ns2;
        var distance;
        // 角度转换为弧度
        ew1 = lng1 * DEF_PI180;
        ns1 = lat1 * DEF_PI180;
        ew2 = lng2 * DEF_PI180;
        ns2 = lat2 * DEF_PI180;
        // 求大圆劣弧与球心所夹的角(弧度)
        distance = Math.sin(ns1) * Math.sin(ns2) + Math.cos(ns1) * Math.cos(ns2) * Math.cos(
                ew1 - ew2);
        // 调整到[-1..1]范围内，避免溢出
        if (distance > 1.0) {
            distance = 1.0;
        } else if (distance < -1.0) {
            distance = -1.0;
        }
        // 求大圆劣弧长度
        distance = DEF_R['BAIDU'] * Math.acos(distance);
        return distance;
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    var outOfChina = function outOfChina (lng, lat) {
        return (
               lng < 72.004 || lng > 137.8347
               ) || (
               (
               lat < 0.8293 || lat > 55.8271
               ) || false
               );
    };

    //var xxx = getDistanceGoogle(39.929658, 116.395504, 39.930066, 116.395571);
    //var qqq = getDistanceGoogle2(39.929658, 116.395504, 39.930066, 116.395571);
    //var yyy = getShortDistanceBaidu(39.929658, 116.395504, 39.930066, 116.395571);
    //var zzz = getLongDistanceBaidu(39.929658, 116.395504, 39.930066, 116.395571);
    //console.log(xxx);
    //console.log(qqq);
    //console.log(yyy);
    //console.log(zzz);
    return {
        DEF_PI: DEF_PI,
        DEF_2PI: DEF_2PI,
        EARTH_RADIUS_BAIDU: DEF_R['BAIDU'],
        EARTH_RADIUS_GOOGLE: DEF_R['GOOGLE'],
        outOfChina: outOfChina,
        getLongDistanceBaidu: getLongDistanceBaidu,
        bd09ToGcj02: bd09ToGcj02,
        wgs84ToGcj02: wgs84ToGcj02,
        gcj02ToBd09: gcj02ToBd09,
        gcj02ToWgs84: gcj02ToWgs84,
        transformLng: transformLng,
        transformLat: transformLat,
        getDistanceGoogle: getDistanceGoogle,
        getDistanceGoogle2: getDistanceGoogle2,
        getShortDistanceBaidu: getShortDistanceBaidu
    };
});