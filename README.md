# react-native-graphic-payments
Componente para montar gráfico de pagamentos no ano

## Install
add in package.json:
```bash
"react-native-graphic-payments": "git+https://libs:ofImhksJ@git.codificar.com.br/react-components/react-native-graphic-payments.git",
```

execute the command:
```bash
$ yarn
or
$ npm install 
```

## Usage

```javascript
import React from 'react'
import ReportPayment from 'react-native-graphic-payments'


  returnValue = (value) => {
    console.log('response request: ', value)
  }

 
<ReportMainScreen 
  providerId={6}
  providerToken='2y10YUhmbobjYuDDCX8EAngore3Vk4KtYPBs1X9o6vSGQUZ75aBsRHTC'
  routeReport='https://dev3.motoristaprivado.com.br/api/v3/provider/profits'
  year={2020}
  returnSelectedItem={this.openDetail.bind(this.periodDetail)}
  currency='R$'
  paymentSubtitle='Gráfico do período'
/>


```



## Properties

| Prop  | Default  | Type | isRequired | Description
| :------------ |:---------------:| :---------------:|:---------------:|--
| providerId | '' | `number` | ✔️ | provider id number. |
| providerToken | '' | `string` | ✔️ | provider token. |
| routeReport | '' | `string` | ✔️ | route for API request. |
| year | '' | `number` | ✔️ | a year for search. |
| currency | '' | `string` |  | currency. |
| returnSelectedItem | '' | `callback function` |  | A function who return the selected month. |
| paymentSubtitle | '' | `string` |  | grafic title. |