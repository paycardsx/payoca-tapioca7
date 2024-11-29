import React from 'react';
import { Card, CardContent } from './ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Maria Silva",
    text: "As melhores tapiocas que já comi! A goma rendada faz toda diferença.",
    rating: 5
  },
  {
    name: "João Santos",
    text: "Entrega super rápida e as tapiocas chegam quentinhas. Recomendo!",
    rating: 5
  },
  {
    name: "Ana Lima",
    text: "O queijo coalho é realmente de qualidade. Vale cada centavo!",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-secondary/5">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">O que nossos clientes dizem</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-text-secondary">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;