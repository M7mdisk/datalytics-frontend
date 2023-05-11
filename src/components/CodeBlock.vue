<template>
  <div>
    <pre ref="codeBlock" :class="`language-${language}`"></pre>
  </div>
</template>
  
<script>
import { ref, onMounted, watch } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'javascript',
    },
  },
  setup(props) {
    const codeBlock = ref(null);

    onMounted(() => {
      if (codeBlock.value) {
        Prism.languages.python = Prism.languages.extend('python', {});
        Prism.languages.bash = Prism.languages.extend('bash', {});
        Prism.languages.javascript = Prism.languages.extend('js', {});
        let lang = props.language.toLowerCase();
        if (lang == 'curl')
          lang = 'bash';
        if (lang == 'javascript')
          lang = 'js'

        codeBlock.value.innerHTML = Prism.highlight(props.code, Prism.languages[lang], props.language);
        codeBlock.value.classList.add('prism-okaidia');
      }
    });

    watch(() => [props.code, props.language], () => {
      if (codeBlock.value) {
        let lang = props.language.toLowerCase();
        if (lang == 'curl')
          lang = 'bash';
        if (lang == 'javascript')
          lang = 'js'

        codeBlock.value.innerHTML = Prism.highlight(props.code, Prism.languages[lang], props.language);
      }
    });

    return {
      codeBlock,
    };
  },
};
</script>
  
<style>
/* pre[class*="language-"],
code[class*="language-"] {
  white-space: normal;
  overflow: auto;
  word-break: break-word;
} */
</style>