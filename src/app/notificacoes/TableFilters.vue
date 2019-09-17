<template lang="pug">
#notificacaoTableFilters.px-4
  v-layout(row wrap)
    v-flex.px-1(
      xs12
      md4
      )
      v-autocomplete(
        label="Tipo de cadastro"
        v-model="tipoCadastro"
        :items="tiposCadastros"
        clearable
        )
    v-flex.px-1(
      xs12
      md4
      )
      v-autocomplete(
        label="Tipo de usuário"
        v-model="tipoUsuario"
        :items="tiposUsuarios"
        clearable
        )
    v-flex.px-1(
      v-if="showFilterCategoria"
      xs12
      md4
      )
      v-autocomplete(
        label="Categoria do estabelecimento/serviço"
        v-model="categoria"
        :items="categorias"
        clearable
        @input="getAllSegments()"
        )
    v-flex.px-1(
      v-if="showFilterSegmento"
      xs12
      md4
      )
      v-autocomplete(
        label="Segmento"
        v-model="segmento"
        :items="segmentos"
        clearable
        )
    v-flex.px-1(
      xs12
      md4
      )
      v-autocomplete(
        label="Estados"
        v-model="estado"
        :items="estados"
        item-value="name"
        clearable
        return-object
        )
    v-flex.px-1(
      v-if="showFilterCidade"
      xs12
      md4
      )
      v-autocomplete(
        label="Cidades"
        v-model="cidade"
        :items="cidades"
        clearable
        )
    v-flex.px-1(
      v-if="anuncianteSmartPremium"
      xs12
      md4
      )
      v-autocomplete(
        label="Planos"
        v-model="plano"
        :items="planos"
        clearable
        )
    v-flex.px-1(md4 xs12)
      v-layout
        v-flex(md6 xs12)
          v-menu(
            lazy
            offset-y
            ref="menuInicio"
            full-width
            v-model="menuInicio"
            max-width="290px"
            min-width="290px"
            transition="scale-transition"
            )
            v-text-field(
              readonly
              label="Data de cadastro Inicial"
              slot="activator"
              v-model="dataCadastroInicial"
              @blur="dateInicio = dateFormatte(dataCadastroInicial)"
              clearable
              )
            v-date-picker(
              no-title
              scrollable
              locale="pt-br"
              v-model="dateInicio"
              color="primary"
              @click="menuInicio = false"
              @input="dataCadastroInicial = dateFormatteBR(dateInicio)"
              )
        v-flex.px-1(md6 xs12)
          v-menu(
            lazy
            offset-y
            ref="menuFim"
            full-width
            v-model="menuFim"
            max-width="290px"
            min-width="290px"
            transition="scale-transition"
          )
            v-text-field(
              readonly
              label="Data de cadastro Final"
              slot="activator"
              v-model="dataCadastroFinal"
              @blur="dateFinal = dateFormatte(dataCadastroFinal)"
              clearable
            )
            v-date-picker(
              no-title
              scrollable
              locale="pt-br"
              v-model="dateFinal"
              color="primary"
              @click="menuFim = false"
              @input="dataCadastroFinal = dateFormatteBR(dateFinal)"
            )
</template>

<script>
import CategoriaService from '@/services/CategoriaService';
import EstadosService from '@/services/EstadosService';
import CidadesService from '@/services/CidadesService';
import PlanosService from '@/services/PlanosService';
import moment from 'moment';

export default {
  name: 'notificacao-table-filters',

  props: {
    filters: {
      type: Object,
    },
  },

  data: () => ({
    tiposCadastros: [
      {
        text: 'Pessoa Física',
        value: 'PessoaFisica',
      },
      {
        text: 'Pessoa Jurídica',
        value: 'PessoaJuridica',
      },
    ],
    tiposUsuarios: [
      {
        text: 'Anunciante Smart',
        value: 'AnuncianteSmart',
      },
      {
        text: 'Anunciante Smart Premium',
        value: 'AnuncianteSmartPremium',
      },
      {
        text: 'Cliente Smart',
        value: 'ClienteSmart',
      },
      {
        text: 'Cliente Smart Premium',
        value: 'ClienteSmartPremium',
      },
    ],
    categorias: [],
    segmentos: [],
    estados: [],
    cidades: [],
    planos: [],
    dateInicio: '',
    dateFinal: '',
    menuInicio: false,
    menuFim: false,
  }),

  computed: {
    tipoCadastro: {
      get() {
        const { tipoCadastro } = this.filters;
        return tipoCadastro;
      },
      set(value) {
        const { filters } = this;
        filters.tipoCadastro = value;
        this.$emit('set-filters', filters);
      },
    },
    tipoUsuario: {
      get() {
        const { tipoUsuario } = this.filters;
        return tipoUsuario;
      },
      set(value) {
        const { filters } = this;
        filters.tipoUsuario = value;
        this.$emit('set-filters', filters);
      },
    },
    categoria: {
      get() {
        const { categoria } = this.filters;
        return categoria;
      },
      set(value) {
        const { filters } = this;
        filters.categoria = value;
        this.$emit('set-filters', filters);
      },
    },
    showFilterCategoria() {
      return this.tipoCadastroPessoaJuridica || this.tipoUsuarioAnunciante;
    },
    tipoCadastroPessoaJuridica() {
      const { tipoCadastro } = this;
      return tipoCadastro === 'PessoaJuridica';
    },
    tipoUsuarioAnunciante() {
      return this.anuncianteSmart || this.anuncianteSmartPremium;
    },
    anuncianteSmart() {
      const { tipoUsuario } = this;
      return tipoUsuario === 'AnuncianteSmart';
    },
    anuncianteSmartPremium() {
      const { tipoUsuario } = this;
      return tipoUsuario === 'AnuncianteSmartPremium';
    },
    showFilterSegmento() {
      const { categoria } = this;
      return !!categoria;
    },
    segmento: {
      get() {
        const { segmento } = this.filters;
        return segmento;
      },
      set(value) {
        const { filters } = this;
        filters.segmento = value;
        this.$emit('set-filters', filters);
      },
    },
    estado: {
      get() {
        const { estado } = this.filters;
        return estado;
      },
      set(value) {
        const { filters } = this;
        if (value) {
          filters.estado = value.name;
          this.getCitiesByState(value.id);
        }
        if (!value) {
          filters.estado = '';
        }
        this.$emit('set-filters', filters);
      },
    },
    cidade: {
      get() {
        const { cidade } = this.filters;
        return cidade;
      },
      set(value) {
        const { filters } = this;
        filters.cidade = value;
        this.$emit('set-filters', filters);
      },
    },
    plano: {
      get() {
        const { plano } = this.filters;
        return plano;
      },
      set(value) {
        const { filters } = this;
        filters.plano = value;
        this.$emit('set-filters', filters);
      },
    },
    dataCadastroInicial: {
      get() {
        const { dataCadastroInicial } = this.filters;
        return this.dateFormatteBR(dataCadastroInicial);
      },
      set(value) {
        const { filters } = this;
        filters.dataCadastroInicial = this.dateFormatte(value);
        this.$emit('set-filters', filters);
      },
    },
    dataCadastroFinal: {
      get() {
        const { dataCadastroFinal } = this.filters;
        return this.dateFormatteBR(dataCadastroFinal);
      },
      set(value) {
        const { filters } = this;
        filters.dataCadastroFinal = this.dateFormatte(value);
        this.$emit('set-filters', filters);
      },
    },
    showFilterCidade() {
      const { estado } = this;
      return !!estado;
    },
  },

  created() {
    this.getAllCategories();
    this.getAllStates();
    this.getAllPlans();
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao buscar os informações.',
      type: 'error',
    },
  },

  methods: {
    getAllCategories() {
      CategoriaService
        .facade()
        .findAllWithoutPaginate()
        .then(({ data }) => {
          data.map((categoria) => {
            this.categorias.push({
              text: categoria.titulo,
              value: categoria.id,
            });
          });
        });
    },
    getAllSegments() {
      this.segmentos = [];
      if (this.categoria) {
        CategoriaService
        .facade()
        .find(this.categoria)
        .then(({ data }) => {
          const { segmentos } = data.item;
          segmentos.map((segmento) => {
            this.segmentos.push({
              text: segmento.descricao,
              value: segmento.id,
            });
          });
        });
      }
    },
    getAllStates() {
      EstadosService
        .facade()
        .getAll()
        .then(({ data }) => {
          data.map((estado) => {
            this.estados.push({
              text: `${estado.sigla} - ${estado.nome}`,
              name: estado.nome,
              id: estado.id,
            });
          });
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao buscar os estados na api do ibge.',
          })
        });
    },
    getCitiesByState(estado) {
      if (estado && estado !== this.estado) {
        this.cidades = [];
        CidadesService
        .facade()
        .getCitiesByState(estado)
        .then(({ data }) => {
          data.map((cidade) => {
            this.cidades.push({
              text: cidade.nome,
              value: cidade.nome,
            });
          });
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao buscar as cidades na api do ibge.',
          })
        });
      }
    },
    getAllPlans() {
      PlanosService
        .facade()
        .getPlans()
        .then(({ data }) => {
          data.map(({ titulo, id }) => {
            this.planos.push({
              text: titulo,
              value: id,
            });
          });
        });
    },
    dateFormatteBR(data) {
      moment.locale('pt-br');
      if (!data) {
        return '';
      }

      return moment(data, 'YYYY-MM-DD').format('l');
    },
    dateFormatte(data) {
      if (!data) {
        return '';
      }

      return moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
    },
  },
  watch: {
    showFilterCategoria: {
      handler(value) {
        if (!value) {
          this.categoria = '';
          this.segmento = '';
        }
      },
    },
    showFilterSegmento: {
      handler(value) {
        if (!value) {
          this.segmento = '';
        }
      },
    },
    estado: {
      handler(value) {
        if (!value) {
          this.cidade = '';
          this.cidades = [];
        }
      },
    },
    anuncianteSmartPremium: {
      handler(value) {
        if (!value) {
          this.plano = '';
        }
      },
    },
  },
};
</script>
