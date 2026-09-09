# Tarjeta de decisiones de negocio — PAY-102

**Una por equipo. Se entrega impresa o en un archivo aparte, nunca en el
repositorio de los participantes.**

---

## Cómo se usa

Ustedes son el dueño del producto de este caso. Estas son sus respuestas.

**No peguen esta tarjeta completa en el prompt.** Ábranla solo cuando
Claude pregunte, y respondan únicamente lo que preguntó. Si Claude nunca
pregunta algo, no se lo regalen: eso es exactamente lo que el debrief va a
mirar.

Si Claude asume una regla sin preguntarla, anótenlo. Vale tanto como una
respuesta.

---

## El brief, tal como lo recibieron

> "Evitar que un pago pueda regresar a un estado anterior."

Contexto que pueden dar si Claude pregunta quién necesita el cambio:
operaciones está viendo pagos que vuelven a un estado anterior cuando el
proveedor reenvía notificaciones viejas. Es urgente para el cierre de mes.

---

## Las respuestas

**1. ¿Qué transiciones son válidas?**

Un pago pendiente puede pasar a aprobado o a rechazado. Nada más.

**2. ¿Aprobado y rechazado son estados terminales?**

Sí. Una vez que un pago llega a cualquiera de los dos, no sale de ahí por
una notificación del proveedor. Las devoluciones y las disputas son otro
flujo y hoy no existen en este servicio.

**3. ¿Qué pasa si el proveedor repite exactamente el mismo estado?**

No es un error. No cambia nada y el servicio devuelve el pago como está.
El proveedor reenvía notificaciones y eso no puede romper nada.

**4. ¿Y si el estado que llega no es ninguno de los conocidos?**

No se guarda. Un valor no reconocido nunca puede quedar registrado como el
estado del pago: se rechaza y el pago se queda como estaba.

**5. ¿Qué debe pasar cuando se rechaza una actualización?**

Un error tipado, no un fallo silencioso. El mensaje tiene que decir de qué
estado a qué estado se intentó ir, porque quien lo lee en producción
necesita saberlo sin abrir el código.

**6. ¿Puede cambiar la forma en que el proveedor y el resto del sistema
llaman al servicio?**

No. Quien ya integra con este servicio no se entera del cambio.

---

## Si preguntan algo que no está aquí

Decidan ustedes, anótenlo como decisión del equipo y déjenlo escrito en la
spec. Una decisión documentada es válida; una decisión que Claude tomó solo
y nadie revisó, no.
