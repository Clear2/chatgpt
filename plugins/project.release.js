#!/usr/bin/env node
const path = require('path')
const child_process = require('child_process')
const simpleGit = require('simple-git')
const fs = require('fs-extra')
const ora = require('ora')


// import path from 'path'
// import * as child_process from "child_process";
// import simpleGit from "simple-git";
// import fs from 'fs-extra'
// import ora from 'ora'
//
// import { fileURLToPath } from 'url';
//
// const __filename = fileURLToPath(import.meta.url);
//
// const __dirname = path.dirname(__filename);

const spinner = ora();
const root = path.resolve(__dirname, '../');
const branch = process.argv.slice(2)[0];
const projectName = root.match(/[^\/\\]+$/)[0];
const sshUrl = `ssh://git@g.hz.netease.com:22222/sale_go/${projectName}.git`;
let git = null;
const args = argsParse(process.argv.slice(3));

async function projectRelease(){
  const rootGit = simpleGit({baseDir: root, binary: 'git'});
  const commitMessage = args['message'] || args['m'] || args['message_backup'];

  if(commitMessage){
    // 提交代码至远程
    spinner.start('git add .');
    await rootGit.add('./*',(e)=>{
      if(e){
        spinner.fail('git add .');
        throw e;
      }
    });
    spinner.succeed('git add .');

    spinner.start('git commit -m "' + commitMessage + '"');
    await rootGit.commit(commitMessage,(e)=>{
      if(e){
        spinner.fail('git commit -m "' + commitMessage + '"');
        throw e;
      }
    })
    spinner.succeed('git commit -m "' + commitMessage + '"');

    spinner.start('git pull');
    await rootGit.pull((e)=>{
      if(e){
        spinner.fail('git pull');
        throw e;
      }
    })
    spinner.succeed('git pull');

    spinner.start('git push');
    await rootGit.push((e)=>{
      if(e){
        spinner.fail('git push');
        throw e;
      }
    })
    spinner.succeed('git push');
  }else{
    // 检查本地修改是否同步至远程
    spinner.start('检查本地修改是否同步至远程');
    const rootStatus = await rootGit.status(['-s']);
    if(rootStatus.files && rootStatus.files.length){
      spinner.fail('请 push 本地修改后重试');
      process.exit();
    }else{
      spinner.succeed('本地修改已同步至远程');
    }
  }

  // 打包
  if(branch === "release" || (branch === 'online' && commitMessage) || (branch === 'online' && args['nos']==='true')){
    if(args['nos']==='true'){
      spinner.start('打包应用程序（NOS）');
      await runExec(`vite build --base=https://sales.ws.126.net/f2e/${projectName}/`, root);
      await fs.remove(path.resolve(root, 'dist/.gitkeep'));
      spinner.succeed('应用程序打包（NOS）完成');
    }else{
      spinner.start('打包应用程序');
      await runExec(`npm run build`, root);
      await fs.remove(path.resolve(root, 'dist/.gitkeep'));
      spinner.succeed('应用程序打包完成');
    }
    await UpdateBranch('release');
  }

  if(branch === "online"){
    await UpdateBranch('online');
  }
}

projectRelease();

function runExec(cmd, cwd){
  return new Promise(resolve => {
    child_process.exec(cmd,{ cwd: cwd }, (error, stdout, stderr)=>{
      if(error) throw Error(error);
      resolve(stdout);
    })
  })
}

async function UpdateBranch(branch){
  const branchDir = path.resolve(root, `.git/${branch}`);
  const projectUrl = `${branch === "release" ? "http://test.go.163.com/web/sale_go/" : "https://go.163.com/f2e/" }${projectName}/index.html`;
  // 拉取分支
  spinner.start(`正在拉取 ${branch} 分支`);
  if(await fs.pathExists(branchDir)){
    git = simpleGit({baseDir: branchDir, binary: 'git'});
    await git.pull();
  }else{
    await simpleGit().clone(sshUrl, branchDir, ['-b', branch]);
    git = simpleGit({baseDir: branchDir, binary: 'git'});
  }
  spinner.succeed(`${branch} 分支拉取成功`);

  // 复制到分支
  spinner.start(`正在更新 ${branch} 分支`);
  if(branch === "release"){
    await fs.emptyDir(path.resolve(branchDir, 'assets'));
    await fs.copy(path.resolve(root, 'dist'), branchDir);
  }else if(branch === "online"){
    const releaseData = (await git.log(['remotes/origin/release','-1'])).latest;
    await fs.writeJson(path.resolve(branchDir, 'commit.log'), releaseData, {spaces: 2});
  }
  const status = await git.status(['-s']);
  if(status.files && status.files.length){
    spinner.succeed(`${ branch } 分支更新完成`);
  }else{
    spinner.warn(`${ branch } 分支已经是最新版本了，无需同步`);
    process.exit();
  }

  // 提交分支至远程
  spinner.start(`提交 ${ branch } 分支至远程`);
  try {
    await git.add('.').commit(branch).push('origin', branch);
  }catch (e){
    if(/Could not read from remote repository|Name or service not known|Connection timed out/.test(e.message)){
      spinner.fail('远程仓库无法连接，同步失败。');
    }else{
      spinner.fail('未知错误');
      console.log(e);
      process.exit();
    }
  }
  spinner.succeed(`已同步至${ branch === "release" ? "测试" : "正式" }地址：${projectUrl}`);
}

function argsParse(args){
  const _args = {};
  args.forEach(arg => {
    const [key, value] = arg.split('=');
    _args[key.replace(/^--/,'')] = value;
    if(!value) _args['message_backup'] = key;
  });
  return _args;
}
