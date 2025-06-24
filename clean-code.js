#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 清理代码文件中的注释和空行
 * @param {string} filePath 文件路径
 * @param {Object} options 选项
 * @returns {string} 清理后的内容
 */
function cleanCodeFile(filePath, options = {}) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let cleanedContent = content;
        let originalLength = content.length;
        
        if (options.verbose) {
            console.log(`📁 开始处理文件: ${filePath}`);
            console.log(`📊 文件大小: ${(originalLength / 1024).toFixed(2)} KB`);
        }
        
        // 删除HTML注释 <!-- -->
        if (options.removeHtmlComments !== false) {
            cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');
            if (options.verbose) console.log('✅ 已删除HTML注释');
        }
        
        // 删除JavaScript单行注释 //
        if (options.removeJsComments !== false) {
            cleanedContent = cleanedContent.replace(/\/\/.*$/gm, '');
            if (options.verbose) console.log('✅ 已删除JavaScript单行注释');
        }
        
        // 删除JavaScript多行注释 /* */
        if (options.removeJsComments !== false) {
            cleanedContent = cleanedContent.replace(/\/\*[\s\S]*?\*\//g, '');
            if (options.verbose) console.log('✅ 已删除JavaScript多行注释');
        }
        
        // 删除CSS单行注释 //
        if (options.removeCssComments !== false) {
            cleanedContent = cleanedContent.replace(/(?<=<style[^>]*>[\s\S]*?)\/\/.*$/gm, '');
            if (options.verbose) console.log('✅ 已删除CSS单行注释');
        }
        
        // 删除CSS多行注释 /* */
        if (options.removeCssComments !== false) {
            cleanedContent = cleanedContent.replace(/(?<=<style[^>]*>[\s\S]*?)\/\*[\s\S]*?\*\//g, '');
            if (options.verbose) console.log('✅ 已删除CSS多行注释');
        }
        
        // 删除空行
        if (options.removeEmptyLines !== false) {
            const lines = cleanedContent.split('\n');
            const nonEmptyLines = lines.filter(line => line.trim() !== '');
            cleanedContent = nonEmptyLines.join('\n');
            if (options.verbose) {
                console.log(`✅ 已删除所有空行 (从 ${lines.length} 行减少到 ${nonEmptyLines.length} 行)`);
            }
        }
        
        // 清理行尾空白
        if (options.trimTrailingWhitespace !== false) {
            cleanedContent = cleanedContent.split('\n').map(line => line.replace(/\s+$/, '')).join('\n');
            if (options.verbose) console.log('✅ 已清理行尾空白（保留缩进）');
        }
        
        // 清理文件首尾空行
        if (options.trimFileEnds !== false) {
            cleanedContent = cleanedContent.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '');
            if (options.verbose) console.log('✅ 已清理文件首尾空行');
        }
        
        const finalLength = cleanedContent.length;
        const savedBytes = originalLength - finalLength;
        const savedPercent = ((savedBytes / originalLength) * 100).toFixed(2);
        
        if (options.verbose) {
            console.log(`📊 清理完成:`);
            console.log(`   原始大小: ${(originalLength / 1024).toFixed(2)} KB`);
            console.log(`   清理后大小: ${(finalLength / 1024).toFixed(2)} KB`);
            console.log(`   节省空间: ${(savedBytes / 1024).toFixed(2)} KB (${savedPercent}%)`);
        }
        
        return cleanedContent;
    } catch (error) {
        console.error(`❌ 读取文件失败: ${filePath}`, error.message);
        return null;
    }
}

/**
 * 处理单个文件
 * @param {string} filePath 文件路径
 * @param {Object} options 选项
 */
function processFile(filePath, options = {}) {
    const { backup = true, verbose = true, ...cleanOptions } = options;
    
    if (verbose) {
        console.log(`\n🔄 正在处理文件: ${filePath}`);
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 文件不存在: ${filePath}`);
        return false;
    }
    
    // 备份原文件
    if (backup) {
        const backupPath = filePath + '.backup';
        try {
            fs.copyFileSync(filePath, backupPath);
            if (verbose) console.log(`💾 已备份原文件到: ${backupPath}`);
        } catch (error) {
            console.error(`❌ 备份文件失败: ${backupPath}`, error.message);
            return false;
        }
    }
    
    // 清理文件
    const cleanedContent = cleanCodeFile(filePath, { verbose, ...cleanOptions });
    if (cleanedContent === null) {
        return false;
    }
    
    // 写入清理后的内容
    try {
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        if (verbose) console.log(`✅ 文件清理完成: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ 写入文件失败: ${filePath}`, error.message);
        return false;
    }
}

/**
 * 递归处理目录中的所有文件
 * @param {string} dirPath 目录路径
 * @param {Object} options 选项
 */
function processDirectory(dirPath, options = {}) {
    const { extensions = ['.vue', '.js', '.ts', '.jsx', '.tsx'], verbose = true, ...cleanOptions } = options;
    
    if (verbose) {
        console.log(`\n📁 开始处理目录: ${dirPath}`);
    }
    
    try {
        const items = fs.readdirSync(dirPath);
        let processedCount = 0;
        let successCount = 0;
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 递归处理子目录
                const subResult = processDirectory(fullPath, options);
                processedCount += subResult.processed;
                successCount += subResult.success;
            } else if (stat.isFile()) {
                // 检查文件扩展名
                const ext = path.extname(item).toLowerCase();
                if (extensions.includes(ext)) {
                    processedCount++;
                    if (processFile(fullPath, cleanOptions)) {
                        successCount++;
                    }
                }
            }
        }
        
        if (verbose) {
            console.log(`📊 目录处理完成: ${dirPath} (${successCount}/${processedCount} 个文件)`);
        }
        
        return { processed: processedCount, success: successCount };
    } catch (error) {
        console.error(`❌ 读取目录失败: ${dirPath}`, error.message);
        return { processed: 0, success: 0 };
    }
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log(`
🔧 代码清理工具 v1.0

使用方法:
  node clean-code.js <文件路径或目录路径> [选项]

参数:
  <路径>    要处理的文件或目录路径

选项:
  --no-backup              不备份原文件
  --no-verbose             不显示详细输出
  --no-html-comments       不删除HTML注释
  --no-js-comments         不删除JavaScript注释
  --no-css-comments        不删除CSS注释
  --no-empty-lines         不删除空行
  --no-trim-whitespace     不清理行尾空白
  --no-trim-ends           不清理文件首尾空行
  --extensions <扩展名>     指定要处理的文件扩展名 (默认: .vue,.js,.ts,.jsx,.tsx)

示例:
  # 处理单个文件
  node clean-code.js ./src/App.vue

  # 处理整个目录
  node clean-code.js ./src/components

  # 不备份原文件
  node clean-code.js ./src --no-backup

  # 只删除注释，保留空行
  node clean-code.js ./src --no-empty-lines

  # 只处理.js文件
  node clean-code.js ./src --extensions .js

  # 静默模式
  node clean-code.js ./src --no-verbose
`);
}

/**
 * 解析命令行参数
 * @param {string[]} args 命令行参数
 * @returns {Object} 解析后的选项
 */
function parseArgs(args) {
    const options = {
        backup: true,
        verbose: true,
        removeHtmlComments: true,
        removeJsComments: true,
        removeCssComments: true,
        removeEmptyLines: true,
        trimTrailingWhitespace: true,
        trimFileEnds: true,
        extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx']
    };
    
    const paths = [];
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--no-backup':
                options.backup = false;
                break;
            case '--no-verbose':
                options.verbose = false;
                break;
            case '--no-html-comments':
                options.removeHtmlComments = false;
                break;
            case '--no-js-comments':
                options.removeJsComments = false;
                break;
            case '--no-css-comments':
                options.removeCssComments = false;
                break;
            case '--no-empty-lines':
                options.removeEmptyLines = false;
                break;
            case '--no-trim-whitespace':
                options.trimTrailingWhitespace = false;
                break;
            case '--no-trim-ends':
                options.trimFileEnds = false;
                break;
            case '--extensions':
                if (i + 1 < args.length) {
                    options.extensions = args[++i].split(',').map(ext => ext.startsWith('.') ? ext : '.' + ext);
                }
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
                break;
            default:
                if (!arg.startsWith('--')) {
                    paths.push(arg);
                }
                break;
        }
    }
    
    return { paths, options };
}

/**
 * 主函数
 */
function main() {
    const { paths, options } = parseArgs(process.argv.slice(2));
    
    if (paths.length === 0) {
        console.log('❌ 请指定要处理的文件或目录路径');
        console.log('使用 --help 查看帮助信息');
        process.exit(1);
    }
    
    let totalProcessed = 0;
    let totalSuccess = 0;
    
    for (const targetPath of paths) {
        if (!fs.existsSync(targetPath)) {
            console.error(`❌ 路径不存在: ${targetPath}`);
            continue;
        }
        
        const stat = fs.statSync(targetPath);
        
        if (stat.isFile()) {
            totalProcessed++;
            if (processFile(targetPath, options)) {
                totalSuccess++;
            }
        } else if (stat.isDirectory()) {
            const result = processDirectory(targetPath, options);
            totalProcessed += result.processed;
            totalSuccess += result.success;
        }
    }
    
    if (options.verbose) {
        console.log(`\n🎉 处理完成! 成功处理 ${totalSuccess}/${totalProcessed} 个文件`);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = {
    cleanCodeFile,
    processFile,
    processDirectory,
    parseArgs
}; 