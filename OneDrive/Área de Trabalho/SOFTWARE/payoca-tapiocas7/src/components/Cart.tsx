import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CartContent from './CartContent';
import CartHeader from './cart/CartHeader';
import CartButton from './cart/CartButton';
import DeliveryAddressForm, { DeliveryAddress } from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';
import { NEIGHBORHOODS } from '@/lib/constants';
import { ShoppingBag, X, ChevronRight, MapPin, CreditCard, Send } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartProps {
  items: CartItem[];
  deliveryPrice: number;
  selectedNeighborhood: string;
  deliveryAddress?: DeliveryAddress;
  paymentMethod?: string;
  cashAmount?: number;
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onClearCart: () => void;
  onSetDeliveryAddress: (address: DeliveryAddress) => void;
  onSetPaymentMethod: (method: string) => void;
  onSetCashAmount: (amount: number) => void;
  menuItems: Record<string, CartItem>;
}

const Cart = ({ 
  items, 
  deliveryPrice, 
  selectedNeighborhood,
  deliveryAddress,
  paymentMethod,
  cashAmount,
  onRemoveItem, 
  onIncreaseQuantity,
  onClearCart,
  onSetDeliveryAddress,
  onSetPaymentMethod,
  onSetCashAmount,
  menuItems
}: CartProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const { 
    deliveryAddress: cartDeliveryAddress, 
    paymentMethod: cartPaymentMethod, 
    cashAmount: cartCashAmount,
    handleSetDeliveryAddress: setDeliveryAddressFromCart,
    handleSetPaymentMethod,
    handleSetCashAmount
  } = useCart();

  const PROMO_NEIGHBORHOODS = ['Salvador Lyra', 'Antares', 'Santa Lucia', 'Cleto Marques Luz'];
  const PROMO_DELIVERY_PRICE = 2.00;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalDeliveryPrice = items.filter(item => {
    const allTapiocas = [...menuItems.salgadas, ...menuItems.doces];
    return allTapiocas.some(tapioca => tapioca.id === item.id);
  }).length >= 5 ? 0 : 
    PROMO_NEIGHBORHOODS.includes(selectedNeighborhood) ? PROMO_DELIVERY_PRICE : 
    deliveryPrice;
  const total = subtotal + finalDeliveryPrice;
  const change = cashAmount > total ? cashAmount - total : 0;
  
  // Filtra apenas tapiocas (exclui bebidas)
  const tapiocaItems = items.filter(item => {
    const allTapiocas = [...menuItems.salgadas, ...menuItems.doces];
    return allTapiocas.some(tapioca => tapioca.id === item.id);
  });

  const tapiocaCount = tapiocaItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const remainingForFreeDelivery = Math.max(5 - tapiocaCount, 0);

  const handleExpand = () => {
    if (items.length === 0) {
      toast.error('Adicione itens ao carrinho primeiro');
      return;
    }
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setStep('cart');
  };

  const nextStep = () => {
    if (step === 'cart') {
      if (items.length === 0) {
        toast.error('Adicione itens ao carrinho primeiro');
        return;
      }
      setStep('address');
    } else if (step === 'address') {
      if (!deliveryAddress) {
        toast.error('Por favor, preencha o endereço de entrega');
        return;
      }
      setStep('payment');
    }
  };

  const prevStep = () => {
    if (step === 'payment') setStep('address');
    else if (step === 'address') setStep('cart');
  };

  const handleSendToWhatsApp = () => {
    if (!deliveryAddress || !paymentMethod) {
      toast.error('Por favor, preencha todos os dados necessários');
      return;
    }

    const phoneNumber = '5582996522984'; // Número atualizado
    const orderNumber = Math.floor(Math.random() * 90 + 10); // Gera número aleatório de 2 dígitos (10-99)
    
    let message = `*Novo Pedido #${orderNumber}*\n`;
    message += `*Cliente:* ${deliveryAddress.name} ${deliveryAddress.surname}\n\n`;
    message += `*Itens:*\n`;
    items.forEach(item => {
      message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}`;
    message += `\n*Taxa de Entrega:* R$ ${finalDeliveryPrice.toFixed(2)}`;
    message += `\n*Total:* R$ ${total.toFixed(2)}`;
    
    message += `\n\n*Endereço de Entrega:*`;
    message += `\nRua: ${deliveryAddress.street}, ${deliveryAddress.number}`;
    message += `\nBairro: ${deliveryAddress.neighborhood}`;
    if (deliveryAddress.complement) {
      message += `\nComplemento: ${deliveryAddress.complement}`;
    }
    if (deliveryAddress.reference) {
      message += `\nPonto de Referência: ${deliveryAddress.reference}`;
    }
    message += `\nTelefone: ${deliveryAddress.phone}`;
    
    message += `\n\n*Forma de Pagamento:* ${paymentMethod}`;
    if (paymentMethod.toLowerCase() === 'dinheiro' && cashAmount > 0) {
      message += `\nTroco para: R$ ${cashAmount.toFixed(2)}`;
      const changeAmount = cashAmount - total;
      if (changeAmount > 0) {
        message += `\n*Troco:* R$ ${changeAmount.toFixed(2)}`;
      }
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    handleClose();
    onClearCart();
  };

  const handleSubmitDeliveryAddress = (address: DeliveryAddress) => {
    try {
      setDeliveryAddressFromCart(address);
      setStep('payment');
      toast.success('Endereço salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar endereço');
    }
  };

  const handleSubmitPayment = async (method: string) => {
    try {
      handleSetPaymentMethod(method);
      toast.success('Forma de pagamento selecionada!');
    } catch (error) {
      toast.error('Erro ao selecionar forma de pagamento');
    }
  };

  const handleConsultDelivery = () => {
    handleClose(); // Fecha o carrinho
    // Aguarda o fechamento do carrinho antes de rolar
    setTimeout(() => {
      const deliverySection = document.getElementById('delivery-check');
      if (deliverySection) {
        const yOffset = -100; // Ajuste para compensar o header fixo
        const y = deliverySection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      <CartButton 
        onClick={handleExpand} 
        itemCount={tapiocaCount} 
        total={total}
        remainingForFreeDelivery={remainingForFreeDelivery}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 px-4 pb-4"
          >
            <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden",
                "max-h-[90vh] flex flex-col"
              )}
            >
              {/* Header do Carrinho */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {step === 'cart' && 'Seu Carrinho'}
                    {step === 'address' && 'Endereço de Entrega'}
                    {step === 'payment' && 'Forma de Pagamento'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo do Carrinho */}
              <div className="flex-1 overflow-y-auto">
                {step === 'cart' && (
                  <CartContent
                    items={items}
                    onRemoveItem={onRemoveItem}
                    onIncreaseQuantity={onIncreaseQuantity}
                    deliveryPrice={deliveryPrice}
                    selectedNeighborhood={selectedNeighborhood}
                    menuItems={menuItems}
                  />
                )}
                {step === 'address' && (
                  <div className="p-4">
                    <DeliveryAddressForm
                      onSubmit={handleSubmitDeliveryAddress}
                      initialAddress={deliveryAddress}
                      selectedNeighborhood={selectedNeighborhood}
                      onConsultDelivery={handleConsultDelivery}
                    />
                  </div>
                )}
                {step === 'payment' && (
                  <div className="p-4">
                    <PaymentForm
                      total={total}
                      onSubmit={handleSubmitPayment}
                      onSetCashAmount={handleSetCashAmount}
                    />
                  </div>
                )}
              </div>

              {/* Footer com Botões */}
              <div className="border-t p-4 space-y-4">
                {step === 'cart' && items.length > 0 && (
                  <button
                    onClick={nextStep}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Continuar para Entrega
                  </button>
                )}
                {step === 'address' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={prevStep}
                      className="flex-1 border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                )}
                {step === 'payment' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={prevStep}
                      className="flex-1 border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleSendToWhatsApp}
                      className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Pedido
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;