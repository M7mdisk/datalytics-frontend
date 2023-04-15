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
        codeBlock.value.innerHTML = Prism.highlight(props.code, Prism.languages[props.language], props.language);
        codeBlock.value.classList.add('prism-okaidia');
      }
    });

    watch(() => [props.code, props.language], () => {
      if (codeBlock.value) {
        codeBlock.value.innerHTML = Prism.highlight(props.code, Prism.languages[props.language], props.language);
      }
    });

    return {
      codeBlock,
    };
  },
};
</script>
  