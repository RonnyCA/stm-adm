<template lang="pug">
  #anunciante-details
    .crud-title.pb-4 Detalhes
    v-card
      v-form
        v-container
          v-layout(row wrap)
            v-flex(md5 xs12)
              v-text-field(
                label="Nome completo/Empresa"
                v-model="anunciante.nome"
                readonly
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Categoria"
                v-model="categoria.titulo"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Segmento"
                v-model="segmento.descricao"
                readonly
                )
          v-layout(row wrap)
            v-flex(md4 xs12)
              v-text-field(
                label="Proprietário"
                v-model="anunciante.proprietario"
                readonly
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Descrição"
                v-model="anunciante.descricao"
                readonly
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Email"
                v-model="anunciante.email"
                readonly
                )
          v-layout(row wrap)
            v-flex(md2 xs12)
              v-text-field(
                label="CPF/CNPJ"
                v-model="anunciante.documento"
                :mask="documentoMask"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Telefone Comercial"
                v-model="anunciante.telefone_comercial"
                :mask="maskPhone(anunciante.telefone_comercial)"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Celular"
                v-model="anunciante.celular"
                :mask="maskPhone(anunciante.celular)"
                readonly
                )
            v-flex(md5 xs12)
              v-text-field(
                label="Logradouro"
                v-model="endereco.logradouro"
                readonly
                )
            v-flex(md1 xs12)
              v-text-field(
                label="Número"
                v-model="endereco.numero"
                readonly
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                label="Bairro"
                v-model="endereco.bairro"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Cidade"
                v-model="endereco.cidade"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Estado"
                v-model="endereco.estado"
                readonly
                )
            v-flex(md1 xs12)
              v-text-field(
                label="CEP"
                v-model="endereco.cep"
                mask="#####-###"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Complemento"
                v-model="endereco.complemento"
                readonly
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                label="Site"
                v-model="anunciante.site"
                append-icon="launch"
                @click:append="openNewTab(anunciante.site)"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Instagram"
                v-model="anunciante.instagram"
                append-icon="launch"
                @click:append="openNewTab(anunciante.instagram)"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Facebook"
                v-model="anunciante.facebook"
                append-icon="launch"
                @click:append="openNewTab(anunciante.facebook)"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                :label="labelDataNascimento"
                v-model="formatedDate"
                )
          v-layout(row wrap)
            v-flex(md4 xs12)
              v-text-field(
                label="Status do cadastro"
                v-model="anunciante.status_cadastro"
                readonly
                )
            v-flex(md4 xs12)
              v-text-field(
                ref="smartsTotal"
                label="Smarts"
                v-model="anunciante.smarts_total"
                v-money="smarts"
                readonly
                )
            v-flex(md4 xs12)
              v-text-field(
                label="Interações"
                v-model="anunciante.interatividade"
                readonly
                )

    keywords-card(v-model="keywordsAdvertizer")
    foto-perfil-card(v-model="anunciante.arquivo")
    fotos-card(v-model="anunciante.fotos")
    horarios-atendimento-card(v-model="anunciante.horarios_atendimento")
    horarios-especiais-card(v-model="anunciante")
    secao-smart(v-model="anunciante")
    secao-interatividade(v-model="anunciante")
    v-layout.mt-5(
      v-if="anuncianteEmAnaliseOuReprovado"
      wrap
      row
    )
      v-spacer
      v-btn(
        v-if="anuncianteEmAnalise"
        type="submit"
        color="accent"
        :disabled="$loading.isLoading"
        @click="aprovarOuReprovarAnunciante(false)"
        outline
      ) Reprovar
      v-btn(
        type="submit"
        color="primary"
        :disabled="$loading.isLoading"
        @click="aprovarOuReprovarAnunciante(true)"
        outline
      ) Aprovar
</template>

<script>
import Moment from 'moment';
import UserService from '@/services/UserService';
import CategoriaService from '@/services/CategoriaService';
import FotosCard from '@/components/FotosCard.vue';
import FotoPerfilCard from '@/components/FotoPerfilCard.vue';
import KeywordsCard from '@/components/KeywordsCard.vue';
import HorariosAtendimentoCard from './HorariosAtendimentoCard.vue';
import HorariosEspeciaisCard from './HorariosEspeciaisCard.vue';
import SecaoSmart from './SecaoSmart.vue';
import SecaoInteratividade from './SecaoInteratividade';

export default {
  name: 'anunciante-details-view',

  components: {
    HorariosAtendimentoCard,
    HorariosEspeciaisCard,
    FotosCard,
    FotoPerfilCard,
    KeywordsCard,
    SecaoSmart,
    SecaoInteratividade,
  },

  data: () => ({
    anunciante: {
      telefone_comercial: '',
      celular: '',
      documento: '',
    },
    categoria: {},
    segmento: {},
    smarts: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: false,
    },
  }),

  computed: {
    endereco() {
      return this
        .anunciante
        .endereco || {};
    },
    labelDataNascimento() {
      const { tipo_cadastro: tipoCadastro } = this.anunciante;
      return tipoCadastro === 'PessoaJuridica' ? 'Data de fundação' : 'Data de nascimento';
    },
    formatedDate() {
      const { data_de_nascimento: dataDeNascimento } = this.anunciante;
      return Moment(dataDeNascimento).format('DD/MM/YYYY');
    },
    anuncianteEmAnalise() {
      const { status_cadastro: statusCadastro } = this.anunciante;
      return statusCadastro === 'EmAnalise';
    },
    keywordsAdvertizer() {
      const { palavras_chave: wordsAdvertizer } = this.anunciante;
      return wordsAdvertizer || [];
    },
    anuncianteReprovado() {
      const { status_cadastro: statusCadastro } = this.anunciante;
      return statusCadastro === 'Reprovado';
    },
    anuncianteEmAnaliseOuReprovado() {
      return this.anuncianteEmAnalise || this.anuncianteReprovado;
    },
    documentoMask() {
      const { documento } = this.anunciante;
      if (documento.length > 11) {
        return '##.###.###/####-##';
      }
      return '###.###.###-###';
    },
    balancoSmarts(){
      return this.anunciante.smarts_cedidos - this.anunciante.smarts_recebidos
    }
  },

  created() {
    const { anuncianteId } = this.$route.params;

    if (anuncianteId) {
      this.loadData(anuncianteId);
    }
  },

  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Sucesso ao realizar a operação.',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao carregar.',
      type: 'error',
    },
  },

  methods: {
    maskPhone(phone) {
      if (!phone) {
        return '';
      }
      if (phone.length <= 10) {
        return '(##) ####-#####';
      }
      return '(##) # ####-####';
    },
    loadData(id) {
      this.$loading.start();

      UserService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.anunciante = data;
          this.anunciante.smarts_cedidos = data.smarts_cedidos.toFixed(2);
          this.anunciante.smarts_recebidos = data.smarts_recebidos.toFixed(2);
          this.$refs.smartsTotal.$el.getElementsByTagName('input')[0].value = data.smarts_total.toFixed(2);          
          if (!this.anunciante.arquivo) {
            this.anunciante.arquivo = { url: '' };
          }
          this.loadCategoria(data.categoria_id, data.segmento_id);
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do anunciante.',
          });
        });
    },
    loadCategoria(categoriaId, segmentoId) {
      CategoriaService
        .facade()
        .find(categoriaId)
        .then(({ data }) => {
          const { segmentos, ...category } = data.item;
          this.categoria = category;
          this.segmento = segmentos.find(segmento => segmento.id === segmentoId);

          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da categoria.',
          });
        });
    },
    openNewTab(url) {
      window.open(url, '_blank');
    },
    ativarAnunciante() {
      const { id_usuario: idUsuario } = this.anunciante;
      UserService
        .facade()
        .enable(idUsuario)
        .then(() => {
          this.showSuccess({
            message: `Sucesso ao ativar o anunciante.`,
          });
        })
        .catch(() => {
          this.showError({
            message: `Ocorreu um erro ao ativar o anunciante.`,
          });
        });
    },
    aprovarOuReprovarAnunciante(aprovado) {
      this.$loading.start();
      const { id_usuario: idUsuario } = this.anunciante;
      const text = aprovado ? 'aprovar' : 'reprovar';
      const payload = {
        aprovado,
        idUsuario,
      };
      UserService
        .facade()
        .aprovarOuReprovarUsuario(payload)
        .then(() => {
          if (text === 'aprovar') {
            this.ativarAnunciante();
          }
          this.$loading.finish();
          this.showSuccess({
            message: `Sucesso ao ${text} o anunciante.`,
          });
          this.$router.replace('/anunciantes');
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({
            message: `Ocorreu um erro ao ${text} o anunciante.`,
          });
        });
    },
  },
};
</script>
