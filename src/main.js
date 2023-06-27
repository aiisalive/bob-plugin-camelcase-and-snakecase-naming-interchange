function supportLanguages() {
    return ['auto', 'zh-Hans', 'en'];
}

function translate(query, completion) {
    const translate_text = query.text || '';
    if (translate_text !== '') {
        try {
            var realStr = translate_text.replace(/[\t\r\f\n\s]*/g, '');
            var tfStr = translate_text.replace(/\s/g, '_');
            var resArr = [];
            // resArr.push('软件传过来的原文：' + translate_text);
            // resArr.push('驼峰转换需要的原文：' + tfStr);
            // resArr.push('软件原文去掉空格：' + realStr);
            if (realStr === realStr.toUpperCase()) {
                // 去掉空格之后如果全是大写字母，那就是蛇形转驼峰
                // 驼峰文字
                resArr.push(tfStr.toLowerCase().replace(/_([a-z])/g, function (match, group1) {
                    return group1.toUpperCase();
                }));
            } else if (realStr === realStr.toLowerCase()) {
                // 去掉空格之后如果全是小写字母，那就是蛇形转驼峰
                // 驼峰文字
                resArr.push(translate_text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                    if (+match === 0) return ''; // 处理空格
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                }));
            } else {
                // 有大写有小写，代表是驼峰转蛇形
                // 蛇形文字
                var temp1 = realStr.replace(/([A-Z])/g, '_$1').toUpperCase();
                var resStr;
                if (temp1.startsWith('_')) {
                    resStr = temp1.replace(/^_/, '');
                } else {
                    resStr = temp1;
                }
                resArr.push(resStr);
            }
            completion({
                result: {
                    from: query.detectFrom,
                    to: query.detectTo,
                    toParagraphs: resArr,
                },
            });
        } catch (e) {
            $log.error('字符串转换错误 ==> ' + JSON.stringify(e))
            Object.assign(e, {
                _type: 'network',
                _message: '字符串转换错误 - ' + JSON.stringify(e),
            });
            throw e;
        }
    }
}

exports.supportLanguages = supportLanguages;
exports.translate = translate;