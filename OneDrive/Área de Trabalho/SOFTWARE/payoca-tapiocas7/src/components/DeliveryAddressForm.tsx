import React, { useState, useEffect } from 'react';
import { NEIGHBORHOODS } from '@/lib/constants';
import { MapPin, Phone, Home, Navigation, Building, User, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface DeliveryAddress {
  name: string;
  surname: string;
  cpf: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  reference?: string;
  phone: string;
}

interface Props {
  onSubmit: (address: DeliveryAddress) => void;
  selectedNeighborhood: string;
  onConsultDelivery: () => void;
  initialAddress?: DeliveryAddress;
}

const DeliveryAddressForm = ({ onSubmit, selectedNeighborhood, onConsultDelivery, initialAddress }: Props) => {
  const [address, setAddress] = useState<DeliveryAddress>(() => {
    if (initialAddress) {
      return initialAddress;
    }
    return {
      name: '',
      surname: '',
      cpf: '',
      street: '',
      number: '',
      neighborhood: selectedNeighborhood || '',
      complement: '',
      reference: '',
      phone: ''
    };
  });

  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedNeighborhood) {
      setAddress(prev => ({
        ...prev,
        neighborhood: selectedNeighborhood
      }));
      // Limpa qualquer erro de bairro quando um novo é selecionado
      if (errors.neighborhood) {
        setErrors(prev => ({
          ...prev,
          neighborhood: undefined
        }));
      }
    }
  }, [selectedNeighborhood]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof DeliveryAddress]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = rawValue.length <= 11 ? formatCPF(rawValue) : formatCPF(rawValue.slice(0, 11));
    setAddress(prev => ({ ...prev, cpf: formatted }));
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 10) {
      if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setAddress(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleNeighborhoodChange = (value: string) => {
    const neighborhood = NEIGHBORHOODS.find(n => n.name === value);
    if (neighborhood) {
      setAddress(prev => ({
        ...prev,
        neighborhood: value
      }));
      // Limpa erros quando um bairro válido é selecionado
      if (errors.neighborhood) {
        setErrors(prev => ({
          ...prev,
          neighborhood: undefined
        }));
      }
    }
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;
    
    return true;
  };

  const validateForm = () => {
    const newErrors: Partial<DeliveryAddress> = {};

    if (!address.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!address.surname.trim()) {
      newErrors.surname = 'Sobrenome é obrigatório';
    }
    if (!address.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(address.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    if (!address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }
    if (!address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    if (!address.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    } else if (!NEIGHBORHOODS.some(n => n.name === address.neighborhood && n.available)) {
      newErrors.neighborhood = 'Bairro inválido ou não disponível';
    }
    if (!address.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const phoneNumbers = address.phone.replace(/\D/g, '');
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(address);
      } catch (error) {
        toast.error('Erro ao salvar endereço. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {!selectedNeighborhood && (
        <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Consulte a disponibilidade de entrega antes de prosseguir
            </p>
          </div>
          <button
            type="button"
            onClick={onConsultDelivery}
            className="w-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
          >
            <MapPin className="w-5 h-5" />
            Consultar Entrega
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Nome e Sobrenome */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={address.name}
                onChange={handleInputChange}
                placeholder="Seu nome"
                className={cn(
                  "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                  errors.name ? "border-red-500" : "border-gray-300"
                )}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            <div className="relative">
              <input
                type="text"
                id="surname"
                name="surname"
                value={address.surname}
                onChange={handleInputChange}
                placeholder="Seu sobrenome"
                className={cn(
                  "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                  errors.surname ? "border-red-500" : "border-gray-300"
                )}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.surname && (
              <p className="text-sm text-red-500 mt-1">{errors.surname}</p>
            )}
          </div>
        </div>

        {/* CPF */}
        <div className="space-y-2">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <div className="relative">
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={address.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              className={cn(
                "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                errors.cpf ? "border-red-500" : "border-gray-300"
              )}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.cpf && (
            <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefone para contato
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={address.phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              className={cn(
                "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                errors.phone ? "border-red-500" : "border-gray-300"
              )}
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Bairro */}
        <div className="space-y-2">
          <label htmlFor="neighborhood" className="block text-base font-medium text-gray-700">
            Bairro
          </label>
          <Select 
            value={address.neighborhood || selectedNeighborhood || ''} 
            onValueChange={handleNeighborhoodChange}
          >
            <SelectTrigger 
              id="neighborhood" 
              className="w-full bg-white border-2 border-gray-200 
                focus:ring-4 focus:ring-primary/20 focus:border-primary
                hover:border-primary/50 transition-all duration-200
                h-12 text-base rounded-lg"
            >
              <SelectValue placeholder="Consulte a entrega primeiro" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-lg">
              <div className="p-2 text-sm text-gray-500 border-b">
                Consulte a entrega antes de selecionar
              </div>
              <div className="overflow-y-auto py-1 max-h-[300px]">
                {NEIGHBORHOODS.map((neighborhood) => (
                  <SelectItem 
                    key={neighborhood.name} 
                    value={neighborhood.name}
                    disabled={!neighborhood.available}
                    className={cn(
                      "py-3 px-4 text-base cursor-pointer transition-all duration-200",
                      "hover:bg-primary/5 focus:bg-primary/5",
                      "text-gray-700 font-medium",
                      !neighborhood.available && "opacity-50"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {neighborhood.name}
                      {!neighborhood.available && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Em breve
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          {errors.neighborhood && (
            <p className="text-sm text-red-500 mt-1">{errors.neighborhood}</p>
          )}
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Rua
            </label>
            <div className="relative">
              <input
                type="text"
                id="street"
                name="street"
                value={address.street}
                onChange={handleInputChange}
                placeholder="Nome da rua"
                className={cn(
                  "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                  errors.street ? "border-red-500" : "border-gray-300"
                )}
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.street && (
              <p className="text-sm text-red-500 mt-1">{errors.street}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Número
            </label>
            <div className="relative">
              <input
                type="text"
                id="number"
                name="number"
                value={address.number}
                onChange={handleInputChange}
                placeholder="Número"
                className={cn(
                  "mt-1 block w-full rounded-lg border shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400",
                  "focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
                  errors.number ? "border-red-500" : "border-gray-300"
                )}
              />
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.number && (
              <p className="text-sm text-red-500 mt-1">{errors.number}</p>
            )}
          </div>
        </div>

        {/* Complemento e Referência */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
              Complemento (opcional)
            </label>
            <input
              type="text"
              id="complement"
              name="complement"
              value={address.complement}
              onChange={handleInputChange}
              placeholder="Apto, bloco, etc."
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm pl-4 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400
                       focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
              Ponto de Referência (opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="reference"
                name="reference"
                value={address.reference}
                onChange={handleInputChange}
                placeholder="Próximo a..."
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400
                         focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {selectedNeighborhood ? (
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full bg-primary text-white font-medium py-3 px-4 rounded-lg",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "transition-colors relative",
            isSubmitting && "opacity-75 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">Continuar para Pagamento</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : (
            'Continuar para Pagamento'
          )}
        </button>
      ) : (
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            Selecione um bairro antes de continuar
          </p>
        </div>
      )}
    </form>
  );
};

export default DeliveryAddressForm;