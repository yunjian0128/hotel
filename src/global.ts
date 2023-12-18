import React from 'react'
import * as ANTD from 'antd-mobile'
import * as Router from 'react-router-dom'
import request from '@/services/request'
import cookie from 'react-cookies'

React.UI = ANTD
React.HTTP = request
React.Router = Router
React.Cookie = cookie

React.success = (msg: string, callback?: Function) => 
{
    React.UI.Toast.show({
        icon: 'success',
        content: msg,
        duration: 1500,
        afterClose: callback ? callback : () =>
        {
            React.navigate(-1)
        }
    })
}

React.error = (msg: string, callback?: Function) => 
{
    React.UI.Toast.show({
        icon: 'fail',
        content: msg,
        duration: 1500,
        afterClose: callback ? callback : () =>
        {
            React.navigate(-1)
        }
    })
}

export default {}