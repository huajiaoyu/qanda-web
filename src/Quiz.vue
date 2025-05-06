<template>
  <div class="quiz-container">
    <header class="quiz-header">
      <h1>{{ questionProcess }}</h1>
      <h1>{{ questionText }}</h1>
      <div class="button-group">
        <button @click="showAnswer" :disabled="buttonDisables.showAnswer">查看答案</button>
        <button @click="showNote" >打开草稿</button>

      </div>
      <div class="button-group">
        <button @click="handleOption('会')"
                :disabled="buttonDisables.option">会
        </button>
        <button @click="handleOption('不会')"
                :disabled="buttonDisables.option">不会
        </button>
        <!--        <button @click="saveAnswer">保存</button>-->
        <!--        <button @click="loadAnswer">读取</button>-->
      </div>
    </header>
    <main class="quiz-main">
      <!-- Markdown 渲染区域 -->
      <div
          class="markdown-rendered"
          v-html="renderedAnswer"
      ></div>
      <textarea v-if="displays.noteText" v-model="noteText" placeholder="请输入草稿"></textarea>
    </main>
  </div>
</template>

<script setup>
import {ref, reactive, watch, computed} from 'vue';
import {useRoute} from 'vue-router';
import apiClient from '@/axios/axios.js'; // 导入配置好的axios实例
import {marked} from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 引入代码高亮样式

// 初始化 marked 的配置
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, {language: validLanguage}).value;
  },
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

const answerText = ref('测试答案');
const realAnswer = ref("");
const noteText = ref('');
const questionText = ref("测试问题")
const questionProcess = ref("0/?")

// 计算属性：解析 Markdown 并生成 HTML
const renderedAnswer = computed(() => {
  return marked(answerText.value);
});

const qId = ref('')
let slotId = ref('');

const buttonDisables = reactive({
  showAnswer: false,
  option: true,
});

const displays = reactive({
  noteText: true
})

const showAnswer = () => {
  // 查看答案的逻辑
  buttonDisables.option = false
  buttonDisables.showAnswer = true
  answerText.value = realAnswer.value
};

const showNote = () => {
  displays.noteText = !displays.noteText
};


const loadQuestion = async () => {
  let response
  response = await apiClient.get('/question/' + slotId.value + '/check');
  console.log("next check:" + response.data.hasNext)
  if (response.data.hasNext == false) {
    const isConfirmed = confirm('已答完，再刷一次？');
    if (!isConfirmed) {
      return;
    } else {
      console.log('准备刷新...');
      await apiClient.get('/question/' + slotId.value + '/refresh');
    }
  }

  response = await apiClient.get('/question/' + slotId.value + '/current');
  console.log("qId:" + response.data.qId)
  qId.value = response.data.qId
  questionText.value = response.data.question
  answerText.value = ""
  realAnswer.value = response.data.answer
  noteText.value = ""

  response = await apiClient.get('/question/' + slotId.value + '/process');
  questionProcess.value = (response.data.cur) + "/" + (response.data.total);

  buttonDisables.showAnswer = false
  buttonDisables.option = true
};

const handleOption = async (option) => {
  // 处理选项选择的逻辑
  console.log(option)
  try {
    let response;
    if (option == "不会") {
      // 存储问题
      const markQueData = {
        slotId: slotId.value,
        qId: qId.value,
      };
      console.log("mark data:" + markQueData.qId);
      response = await apiClient.post('/question/mark', markQueData);
    }
    // 指针后移
    response = await apiClient.get('/question/' + slotId.value + '/next');
    console.log("next:" + response.data.hasNext)
    loadQuestion()

  } catch (error) {
    confirm(error);
    console.error('调用后端接口失败:', error);
  }
};

const saveAnswer = () => {
  // 保存答案的逻辑
};


const loadAnswer = () => {
  // 加载答案的逻辑
};

const route = useRoute();
// 处理重新开始逻辑

const handleRestart = () => {
  console.log('重新开始...');
  // 实现重新开始的逻辑
};
// 处理加载存档逻辑

// 监听路由变化
watch(
    () => route.query,
    (newQuery) => {
      console.log("newQuery:" + newQuery.slotId)
      slotId.value = newQuery.slotId || null;
      loadQuestion()
      // action.value = newQuery.action || null;
      // this.slotId.value = newQuery.slot || null;
      // console.log("action:" + action)
      // console.log("slot" + slot)
      // if (action.value === 'restart') {
      //   handleRestart();
      // } else if (action.value === 'load') {
      //   loadQuestion(slot.value);
      // }
    },
    {immediate: true}
);


</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-header {
  width: 100%;
  text-align: center;
  padding: 1rem;
  background-color: #f4f4f4;
}

.quiz-header h1 {
  font-size: 1.25em; /* 调整字体大小 */
  margin-bottom: 1rem; /* 增加下边距使空间更宽敞 */
}

.button-group {
  display: flex;
  justify-content: center; /* 居中对齐按钮 */
  gap: 1rem; /* 按钮间的间距 */
  flex-wrap: wrap; /* 当屏幕宽度不足时自动换行 */
}

.quiz-main {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}

textarea {
  width: 100%;
  height: 400px;
  padding: 1rem;
  border: 1px solid #ccc;
  resize: none;
}

.markdown-rendered {
  width: 100%;
  height: 400px;
  padding: 1rem;
  border: 1px solid #ccc;
  overflow-y: auto;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
  white-space: pre-wrap; /* 保留换行符 */
}
</style>