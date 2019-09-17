<template lang="pug">
  #oferta-details
    .crud-title.pb-4 Detalhes
    v-form
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
                  readonly
                  label="Título"
                  v-model="publicacao.titulo"
                  )
            v-layout(row wrap)
              v-flex(md4 xs12)
                v-text-field(
                  readonly
                  v-money="money"
                  label="Valor"
                  placeholder="R$ 0,00"
                  v-model="publicacao.valor_sem_desconto"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  readonly
                  mask="###"
                  label="Desconto %"
                  v-model="publicacao.desconto"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  readonly
                  v-money="money"
                  label="Valor Total"
                  placeholder="R$ 0,00"
                  v-model="publicacao.valor_com_desconto"
                  )
            v-layout(row wrap)
              v-flex(md3 xs12)
                v-text-field(
                  v-money="smarts"
                  label="Valor Smarts"
                  v-model="publicacao.valor_em_smarts"
                  )
              v-flex(md3 xs12)    
                v-text-field(
                  readonly
                  v-money="smarts"
                  label="Smarts Gerado"
                  v-model="publicacao.valor_smarts_gerado"
                  )                   
              v-flex(md3 xs12)
                v-text-field(
                  readonly
                  label="Desconto Smarts %"
                  v-model="publicacao.valor_desconto_smarts"
                  )
              v-flex(md3 xs12)
                v-text-field(
                  readonly
                  label="Período"
                  v-model="publicacao.periodo_de_publicacao"
                  )                 
            v-layout(row-wrap)
              v-flex(xs12)
                v-textarea(
                  readonly
                  label="Descrição"
                  v-model="publicacao.descricao"
                  placeholder="Digite uma descrição..."
                  )
            v-flex(xs3)
            .preview(v-if="hasImage")
              a(:href="publicacao.arquivo.url" target="_blank")
                  img.imageBoxPreview(:src="publicacao.arquivo.url")
            input.invisible(
              type="file"
              ref="files"
              accept="image/*"
              @change="getFileData($event)"
              )  
            v-layout(v-if="isWaitingReview" row)
              confirm-dialog(
                v-model="showConfirmDialog"
                :otherType="otherOption"
                @approve-offer="statusHandler('Aprovada')"
                @reprove-offer="statusHandler('Reprovada')"
                )
              v-spacer
              v-btn(
                flat
                :loading="statusLoader"
                type="submit"
                @click="openConfirmModal(false)"
                )
                | Reprovar
              v-btn(
                outline
                :loading="statusLoader"
                type="submit"
                color="primary"
                @click="openConfirmModal(true)"
                )
                | Aprovar
</template>

<script>
import UserService from '@/services/UserService';
import CategoriaService from '@/services/CategoriaService';
import FotosCard from '@/components/FotosCard.vue';
import AvaliacaoOfertasService from '@/services/AvaliacaoOfertasService';
import ConfirmDialog from './ConfirmDialog.vue';
import OfertasService from '../../services/OfertasService';

export default {
  name: 'ofertas-details-view',

  components: {
    ConfirmDialog,
  },

  data: () => ({
    showConfirmDialog: false,
    statusLoader: false,
    publicacao: {
      categoria: {
        titulo: '',
      },
      avaliacao: {
        status: '',
      },
      titulo: '',
    },
    anunciante: {
      plano: {
        titulo: '',
      }
    },
    categoria: {},
    segmento: {},
    statusButton: true,
    otherOption: true,
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
      this.loadOferta(ofertaId);
    }
  },

  notifications: {
    showAproved: {
      message: 'Oferta Aprovada',
      type: 'success',
    },
    showReproved: {
      message: 'Oferta Reprovada',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao carregar.',
      type: 'error',
    },
    showSuccess: {
      title: 'Sucesso',
      message: 'Registro atualizado com sucesso.',
      type: 'success',
    },
  },
  computed: {
    isWaitingReview() {
      return this.publicacao.avaliacao.status === 'Aguardando';
    },
    hasImage() {
      return this
        .publicacao
        .arquivo
        .url;
    },
  },
  methods: {
    openConfirmModal(bool) {
      this.showConfirmDialog = true;
      this.otherOption = bool;
    },
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
    
    loadOferta(id) {
      this.$loading.start();

      OfertasService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.publicacao = data.item;
          this.loadAnunciante(data.item.anunciante_id);
          this.publicacao.valor_sem_desconto = data.item.valor_sem_desconto.toFixed(2);
          this.publicacao.valor_com_desconto = data.item.valor_com_desconto.toFixed(2);
          this.publicacao.valor_em_smarts = data.item.valor_em_smarts.toFixed(2);
          this.publicacao.valor_smarts_gerado = data.item.valor_smarts_gerado.toFixed(2);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da oferta.',
          });
          this.$loading.finish();
        });
    },
    loadAnunciante(anuncianteId) {
      this.$loading.start();

      UserService
        .facade()
        .find(anuncianteId)
        .then(({ data }) => {
          this.anunciante = data;

          this.loadCategoria(data.categoria_id);
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do Anunciante.',
          });
          this.$loading.finish();
        });
    },
    loadCategoria(categoriaId) {
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
    goToList() {
      this
        .$router
        .push('/ofertas');
    },
    statusHandler(novoStatus) {
      this.$loading.start();
      this.statusLoader = true;
      const { id: avaliacaoId } = this.publicacao.avaliacao;

      AvaliacaoOfertasService
        .facade()
        .alterarStatus(avaliacaoId, novoStatus)
        .then(() => {
          this.statusLoader = false;
          if (novoStatus === 'Aprovada') {
            this.showAproved();
            this.goToList();
          } else {
            this.showReproved();
            this.goToList();
          }
          this.$loading.finish();
        })
        .catch(() => {
          this.statusLoader = false;
          this.showError({
            message: 'Ocorreu um erro ao atualizar a oferta.',
          });
          this.$loading.finish();
        });
    },
    openNewTab(url) {
      window.open(url, '_blank');
    },
  },
};
</script>
