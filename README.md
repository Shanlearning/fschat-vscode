# Fastchat VSCode Extension

使用基于fastchat-openai api接口的 codeshell-vscode插件

[![English readme](https://img.shields.io/badge/README-English-blue)](README_EN.md)

`codeshell-vscode`项目是基于[CodeShell大模型](https://github.com/WisdomShell/codeshell)开发的支持[Visual Studio Code](https://code.visualstudio.com/Download)的智能编码助手插件，支持python、java、c++/c、javascript、go等多种编程语言，为开发者提供代码补全、代码解释、代码优化、注释生成、对话问答等功能，旨在通过智能化的方式帮助开发者提高编程效率。

## 环境要求

- [node](https://nodejs.org/en)版本v18及以上
- Visual Studio Code版本要求 1.68.1 及以上
- [CodeShell 模型服务](https://github.com/WisdomShell/llama_cpp_for_codeshell)已启动

## 编译插件

如果要从源码进行打包，需要安装 `node` v18 以上版本，并执行以下命令：

```zsh
git clone https://github.com/WisdomShell/codeshell-vscode.git
cd codeshell-vscode
npm install
npm exec vsce package
```

然后会得到一个名为`codeshell-vscode-${VERSION_NAME}.vsix`的文件。

##  模型服务
fastchat 开源架构，自行选择模型 https://github.com/lm-sys/FastChat:

这里以千问14B为例：
python -m fastchat.serve.controller --host 0.0.0.0 --port 21001 --dispatch-method shortest_queue

或者nohup python -m fastchat.serve.controller --host 0.0.0.0 --port 21001 --dispatch-method shortest_queue >logs/controller.log 2>&1 &

python -m fastchat.serve.model_worker --host 0.0.0.0 --port 20001 --worker-address http://127.0.0.1:20001 --controller-address http://127.0.0.1:21001 --num-gpus 2 --gpu 0,1 --device cuda --model-path /project/llm_models/Qwen-14B-Chat

或者nohup python -m fastchat.serve.model_worker --host 0.0.0.0 --port 20001 --worker-address http://127.0.0.1:20001 --controller-address http://127.0.0.1:21001 --num-gpus 2 --gpu 0,1 --device cuda --model-path /project/llm_models/Qwen-14B-Chat >logs/qwen_worker.log 2>&1 &

python -m fastchat.serve.openai_api_server --host 0.0.0.0 --port 80 --controller-address http://127.0.0.1:21001

##  模型环境：
docker network create --driver bridge --subnet 172.20.1.0/16 --gateway 172.20.1.0 llm-net

这里假设模型放E盘project文件夹下
docker run --entrypoint /bin/bash --gpus 'all' --name=Qwen-14B-Chat --shm-size 1g --net llm-net -p 81:80 -v E:/project:/project -it ghcr.nju.edu.cn/huggingface/text-generation-inference:1.0.3 

pip install uvicorn anyio starlette fastapi sse_starlette transformers_stream_generator tiktoken -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

pip install --use-pep517 fschat -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

## 配置插件

VSCode中执行`Install from VSIX...`命令，选择`codeshell-vscode-${VERSION_NAME}.vsix`，完成插件安装。

- 设置fastchat模型类别
- 配置是否自动触发代码补全建议
- 配置自动触发代码补全建议的时间延迟
- 配置补全的最大tokens数量
- 配置问答的最大tokens数量
- 配置模型运行环境

注意：不同的模型运行环境可以在插件中进行配置。对于[CodeShell-7B-Chat-int4](https://huggingface.co/WisdomShell/CodeShell-7B-Chat-int4)模型，您可以在`Code Shell: Run Env For LLMs`选项中选择`CPU with llama.cpp`选项。而对于[CodeShell-7B](https://huggingface.co/WisdomShell/CodeShell-7B)和[CodeShell-7B-Chat](https://huggingface.co/WisdomShell/CodeShell-7B-Chat)模型，应选择`GPU with TGI toolkit`选项。

![插件配置截图](https://resource.zsmarter.cn/appdata/codeshell-vscode/screenshots/docs_settings_new.png)

## 功能特性

### 1. 代码补全

- 自动触发代码建议
- 热键触发代码建议

在编码过程中，当停止输入时，代码补全建议可自动触发（在配置选项`Auto Completion Delay`中可设置为1~3秒），或者您也可以主动触发代码补全建议，使用快捷键`Alt+\`（对于`Windows`电脑）或`option+\`（对于`Mac`电脑）。

当插件提供代码建议时，建议内容以灰色显示在编辑器光标位置，您可以按下Tab键来接受该建议，或者继续输入以忽略该建议。

![代码建议截图](https://resource.zsmarter.cn/appdata/codeshell-vscode/screenshots/docs_completion.png)

### 2. 代码辅助

- 对一段代码进行解释/优化/清理
- 为一段代码生成注释/单元测试
- 检查一段代码是否存在性能/安全性问题

在vscode侧边栏中打开插件问答界面，在编辑器中选中一段代码，在鼠标右键CodeShell菜单中选择对应的功能项，插件将在问答界面中给出相应的答复。

![代码辅助截图](https://resource.zsmarter.cn/appdata/codeshell-vscode/screenshots/docs_assistants.png)

### 3. 智能问答

- 支持多轮对话
- 支持会话历史
- 基于历史会话（做为上文）进行多轮对话
- 可编辑问题，重新提问
- 对任一问题，可重新获取回答
- 在回答过程中，可以打断

![智能问答截图](https://resource.zsmarter.cn/appdata/codeshell-vscode/screenshots/docs_chat.png)

在问答界面的代码块中，可以点击复制按钮复制该代码块，也可点击插入按钮将该代码块内容插入到编辑器光标处。

## 开源协议

Apache 2.0

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=WisdomShell/codeshell-vscode&type=Date)](https://star-history.com/#WisdomShell/codeshell-vscode&Date)
