const getBody = req => JSON.parse(req.body.reqData)

module.exports = {
    prefix: '/api',
    delay: 800,
    apiList: [
        {
            url: '/count',
            handle(mock, { state, request, Mock }) {
                // const body = getBody(request)
                state.counter = (state.counter || 0) + 1
                return {
                    resultCode: mock('@integer(0,1)'),
                    resultMsg: '操作成功',
                    resultData: {
                        msg: '',
                        data: state.counter,
                        code: 200
                    }
                }
            }
        },
        {
            url: '/get-count-number',
            handle(mock, { state, request, Mock }) {
                return {
                    count: state.counter || 0
                }
            }
        },
    ]
}
