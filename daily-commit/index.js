#!/usr/bin/env node
const shell = require('shelljs')
const fs = require('fs')
const path = require('path')


// 执行
shell.exec('git add .')
shell.exec(`git commit -m ${getMessage()}`)
shell.exec('git push')

/**
 * 获取自动上传的commit信息
 */
function getMessage() {
    const processPath = process.cwd()
    let lastGitMessage = getLastGitMessage(processPath, 10)
    let todayDate = getDateMessage()
    let commitMessage = todayDate

    let [lastDate, lastCommitIterator] = lastGitMessage.split('@')

    if (lastDate === todayDate) {
        commitMessage = `${todayDate}@${parseInt(lastCommitIterator) + 1}`
    }

    return commitMessage
}
/**
 * 循环寻找git仓库的根目录，取出上次提交的message信息
 * @param {Number} limit 查找目录的最大层数
 */
function getLastGitMessage(curPath, limit) {
    if (!limit) {
        return ''
    }

    const fileNames = fs.readdirSync(curPath)
    return fileNames.indexOf('.git') === -1
        ? getLastGitMessage(path.resolve(curPath, '..'), limit - 1)
        : fs.readFileSync(path.resolve(curPath, '.git', 'COMMIT_EDITMSG'), {
            encoding: 'utf8'
        })
}

/**
 * 获取当天日期的时间
 */
function getDateMessage() {
    const date = new Date()
    let [ year, month, day ] = [ date.getFullYear(), date.getMonth() + 1 , date.getDate() ]
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    return [year, month, day].join('.')
}