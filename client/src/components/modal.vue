<template>
  <v-row justify="center">
    <v-dialog
      v-if="modal"
      :value="modal"
      :width="largura"
      persistent
      scrollable
      @input="$emit('update:modal', $event)"
    >
      <v-card>
        <v-toolbar
          color="primary"
          height="40"
        >
          <v-btn
            v-if="fechar"
            color="accent"
            dark
            icon
            text
            title="Fechar"
            @click="$emit('fechar')"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          <v-toolbar-title class="accent--text">
            {{ titulo }}
          </v-toolbar-title>
          <v-spacer />
          <slot name="acao" />
        </v-toolbar>
        <v-divider class="divider-modal" />
        <slot name="cabecalho" />
        <div id="scroll-modal">
          <slot />
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'ComponenteModal',

  props: {
    largura: {
      type: String,
      required: true
    },
    fechar: {
      default: true,
      type: Boolean
    },
    modal: {
      required: true,
      type: Boolean
    },
    titulo: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .divider-modal {
    background-color: #0eb1ba;
    min-height: 3px;
  }

  #scroll-modal {
    max-height: 900px;
    overflow-y: auto !important;
  }
</style>
