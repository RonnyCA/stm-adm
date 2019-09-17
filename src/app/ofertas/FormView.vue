<template lang="pug">
  #oferta-edit
    .crud-title.pb-4 Editar Oferta
    v-form(
      ref="form"
      v-model="valid"
      @submit="save()"
      lazy-validation
      )
      v-container(grid-list-md)
        v-layout(wrap)
          v-flex(md12 xs12)
            v-text-field(
              readonly
              label="Anunciante"
              v-model="publicacao.nome_anunciante"
              )
          v-flex(md4 xs12)
            v-text-field(
              readonly
              label="Categoria"
              v-model="publicacao.categoria.titulo"
              )
          v-flex(md4 xs12)
            v-text-field(
            readonly
            label="Segmento"
            v-model="anunciante.segmento"
            )
          v-flex(md4 xs12)
            v-text-field(
              readonly
              label="Plano"
              v-model="anunciante.plano.titulo"
              )
      v-card.mt-5
        v-container(grid-list-md)
          v-layout(row wrap)
            v-flex(xs12)
              v-text-field(
                label="Título"
                v-model="publicacao.titulo"
                :rules="[rules.required]"
                )
          v-layout(row wrap)
            v-flex(md4 xs12)
              v-text-field(
                v-money="money"
                min="0"
                label="Valor"
                ref="valorSemDesconto"
                placeholder="R$ 0,00"
                :rules="[rules.required]"
                v-model.lazy="publicacao.valor_sem_desconto"
                @change="alterOfferValues()"
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Desconto %"
                mask="###"
                v-model="publicacao.desconto"
                :rules="[rules.required]"
                @input="alterOfferValues()"
                )
            v-flex(md4 xs12)
              v-text-field(
                readonly
                v-money="money"
                label="Valor Total"
                ref="valorComDesconto"
                placeholder="R$ 0,00"
                :rules="[rules.required]"
                v-model="publicacao.valor_com_desconto"
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                readonly
                v-money="smarts"
                label="Valor Smarts"
                ref="valorEmSmarts"
                :rules="[rules.required]"
                v-model="publicacao.valor_em_smarts"
                )
            v-flex(md3 xs12)    
              v-text-field(
                readonly
                v-money="smarts"
                label="Smarts Gerado"
                ref="valorSmartsGerado"
                v-model="publicacao.valor_smarts_gerado"
                )              
            v-flex(md3 xs12)
              v-text-field(
                label="Desconto Smarts %"
                mask="###"
                :rules="smartsDiscountRules"
                v-model="publicacao.valor_desconto_smarts"
                @input="alterSmartsGenerated()"
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Período"
                :rules="[rules.required]"
                v-model="publicacao.periodo_de_publicacao"
                )
            v-flex(xs12)
              v-textarea(
                label="Descrição"
                :rules="[rules.required]"
                v-model="publicacao.descricao"
                placeholder="Digite uma descrição..."
                )
            v-flex(xs3)
                v-text-field(
                  readonly
                  label="Imagem"
                  v-model="fileName"
                  @click="launchFilePicker()"
                  append-icon="cloud_upload"
                  @click:append="launchFilePicker()"
                  )
            .preview(v-if="hasImage")
              a(:href="publicacao.arquivo.url" target="_blank")
                img.imageBoxPreview(:src="publicacao.arquivo.url")
            input.invisible(
              type="file"
              ref="files"
              accept="image/*"
              @change="getFileData($event)"
              )
          v-layout(row)
            v-spacer
            v-btn(
              flat
              @click="cancelEdit()"
              )
              | Cancelar
            v-btn(
              outline
              type="submit"
              color="primary"
              :disabled="!valid || $loading.isloading"
              )
              | Concluir
</template>

<script>
import UserService from '@/services/UserService';
import FotosCard from '@/components/FotosCard.vue';
import CategoriaService from '@/services/CategoriaService';
import OfertasService from '@/services/OfertasService';
import UploadService from '@/services/UploadService';
import CambioService from '@/services/CambioService';


export default {
  name: 'oferta-edit',


  data: () => ({
    valid: false,
    fileName: '',
    anunciante: {
      plano: {
        titulo: '',
      },
    },
    dialog: false,
    publicacao: {
      categoria: {
        titulo: '',
      },
      titulo: '',
      arquivo: {},
    },
    categoria: {
      segmentos: [],
    },
    plano: {
      titulo: '',
    },
    segmentos: [],
    rules: {
      required: v => !!v || 'Campo Obrigatório',
    },
    money: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      prefix: 'R$ ',
      masked: false,
    },
    smarts: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: false,
    },
  }),
  created() {
    const { ofertaId } = this.$route.params;

    if (ofertaId) {
      this.getOferta(ofertaId);
    }
  },

  computed: {
    hasImage() {
      return this
        .publicacao
        .arquivo
        .url;
    },
    smartsDiscountRules() {
      let minValue = this.anunciante.plano.porcentagem_minima;
      let maxValue = this.anunciante.plano.porcentagem_maxima;
      let valid = true;
      return [
        (v) => {
          if (!v) {
            return 'Campo é obrigatório';
          }

          if (v < minValue) {
            return 'O valor deve ser maior que ' + minValue;
          }
          if (v > maxValue) {
            return 'O valor deve ser menor que ' + maxValue;
          }          
        },
      ];
    },    
  },
  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao carregar.',
      type: 'error',
    },
    showSuccess: {
      title: 'Salvo',
      message: 'Registro atualizado com sucesso!',
      type: 'success',
    },
  },

  methods: {
    launchFilePicker() {
      this
        .$refs
        .files
        .click();
    },
    getFileData(event) {
      const file = event.target.files[0];
      this.fileName = file.name;

      UploadService
        .facade()
        .uploadFile(file)
        .then(({ data }) => {
          const { url } = data;
          const { arquivo } = this.publicacao;
          const fileObject = {
            ...arquivo,
            url,
          };
          this.$set(this.publicacao, 'arquivo', fileObject);
          this.showSuccess({
            message: 'Sucesso ao anexar imagem',
          });
        })
        .catch(({ data }) => {
          this.showError({
            message: data,
          });
        });
    },
    cancelEdit() {
      const options = {
        title: 'Deseja realmente cancelar a edição? Todo o progresso será perdido',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
        customClass: 'roboto-font',
        confirmButtonClass: 'primary roboto-font',
        cancelButtonClass: 'grey roboto-font',
      };
      this
        .$swal(options)
        .then((result) => {
          if (!result.value) {
            return false;
          }
          return this.goToList();
        });
    },
    getOferta(id) {
      this.$loading.start();
      OfertasService
        .facade()
        .find(id)
        .then(({ data }) => {
          const idAnunciante = data.item.anunciante_id;
          delete data.item.anunciante_id;
          this.publicacao = {
            ...data.item,
            id_anunciante: idAnunciante,
          };
          this.getAnunciante(idAnunciante);
          this.$refs.valorSemDesconto.$el.getElementsByTagName('input')[0].value = data.item.valor_sem_desconto.toFixed(2);
          this.$refs.valorComDesconto.$el.getElementsByTagName('input')[0].value = data.item.valor_com_desconto.toFixed(2);
          this.$refs.valorEmSmarts.$el.getElementsByTagName('input')[0].value = data.item.valor_em_smarts.toFixed(2);
          this.$refs.valorSmartsGerado.$el.getElementsByTagName('input')[0].value = data.item.valor_smarts_gerado.toFixed(2);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do anunciante.',
          });
          this.$loading.finish();
        });
    },
    getAnunciante(anuncianteId) {
      this.$loading.start();
      UserService
        .facade()
        .find(anuncianteId)
        .then(({ data }) => {
          this.anunciante = data;
          this.getCategoria(data.categoria_id);
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da anunciante.',
          });
          this.$loading.finish();
        });
    },
    getCategoria(categoriaId) {
      this.$loading.start();
      CategoriaService
        .facade()
        .find(categoriaId)
        .then(({ data }) => {
          this.categoria = data.item;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da categoria.',
          });
          this.$loading.finish();
        });
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    goToList() {
      this
        .$router
        .push('/ofertas');
    },
    openNewTab(url) {
      window.open(url, '_blank');
    },
    save() {
      if (!this.formIsValid()) {
        return false;
      }

      return this.saveEditOfertas();
    },
    saveEditOfertas() {
      if (this.$loading.isLoading) {
        return false;
      }

      this.$loading.start();
      const { publicacao } = this;
      const valorSemDesconto = this.numberConvert(publicacao.valor_sem_desconto);
      const valorComDesconto = this.numberConvert(publicacao.valor_com_desconto);
      const valorEmSmarts = this.numberConvert(publicacao.valor_em_smarts);
      const valorSmartsGerado = this.numberConvert(publicacao.valor_smarts_gerado);
      
      publicacao.valor_sem_desconto = valorSemDesconto;
      publicacao.valor_com_desconto = valorComDesconto;
      publicacao.valor_em_smarts = valorEmSmarts;
      publicacao.valor_smarts_gerado = valorSmartsGerado;

      return OfertasService
        .facade()
        .edit(publicacao.id, publicacao)
        .then(({ data }) => {
          this.$loading.finish();
          this.showSuccess();
          this.goToList();
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({
            message: 'Ocorreu um erro ao salvar a oferta.',
          });
        });
    },
    alterOfferValues() {
      this.$loading.start();
      const offerValues = {};
      offerValues.valor = this.publicacao.valor_sem_desconto ? this.numberConvert(this.publicacao.valor_sem_desconto) : 0;
      offerValues.desconto = this.publicacao.desconto ? this.publicacao.desconto : 0;
      CambioService
        .facade()
        .calculateOfferValues(offerValues)
        .then(({ data }) => {
          this.$refs.valorComDesconto.$el.getElementsByTagName('input')[0].value = data.valor_com_desconto.toFixed(2);
          this.publicacao.valor_com_desconto = data.valor_com_desconto.toFixed(2);
          
          this.$refs.valorEmSmarts.$el.getElementsByTagName('input')[0].value = data.valor_smarts.toFixed(2);
          this.publicacao.valor_em_smarts = data.valor_smarts.toFixed(2);
          
          this.alterSmartsGenerated();
          this.$loading.finish();          
        })
        .catch(({ response }) => {
          this.$loading.finish();
        });
        
    },
    alterSmartsGenerated() {
      this.$loading.start();
      const offerValues = {};
      offerValues.valor_total = this.publicacao.valor_com_desconto.includes('R$') ? this.numberConvert(this.publicacao.valor_com_desconto) : this.publicacao.valor_com_desconto;
      offerValues.desconto_smarts = this.publicacao.valor_desconto_smarts ? this.publicacao.valor_desconto_smarts : 0;
      CambioService
        .facade()
        .calculateSmartsGenerated(offerValues)
        .then(({ data }) => {
          this.$refs.valorSmartsGerado.$el.getElementsByTagName('input')[0].value = data.smarts_gerado.toFixed(2);
          this.publicacao.valor_smarts_gerado = data.smarts_gerado.toFixed(2);
          this.$loading.finish();
        })
        .catch(({ response }) => {
          this.$loading.finish();
        });
    },
    numberConvert(campo) {
      const removerPrefixo = campo.replace(/R. /g, '');
      const removerPonto = removerPrefixo.replace(/\./g, '');
      const formatar = removerPonto.replace(',', '.');
      console.log(campo, formatar);
      return Number(formatar);
    },    
  },
};
</script>
<style lang="stylus">
.preview
  padding 20px

img.imageBoxPreview
  width 200px
  padding 5px
  border 1px dashed darkgrey
  background-color #fafafa
  stroke black
  stroke-dasharray 5

.invisible
  display none
</style>
