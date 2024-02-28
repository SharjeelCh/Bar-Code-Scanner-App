import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data });
    const [productId, price] = data.split('_'); // Assuming data format: productId_price

  // Convert price to a number (assuming it's encoded as a string)
  const realPrice = parseFloat(price);
  console.log('Product ID:', data.split('_')[0]);
    // For demonstration purposes, just adding scanned data to cart
    setCartItems([...cartItems, { id: productId, name: `Product ${productId}`, price: realPrice }]);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>{item.name}</Text>
      <Text>${item.price}</Text>
    </View>
  );

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    // For demonstration purposes, just logging total price
    console.log('Total Price:', getTotalPrice());
    // Resetting the cart
    setCartItems([]);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodeScannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <View style={styles.scannedDataContainer}>
          <Text>Type: {scannedData.type}</Text>
          <Text>Data: {scannedData.data}</Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Cart</Text>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.checkoutButtonContainer}>
          <Text>Total Price: ${getTotalPrice()}</Text>
          <Button title="Checkout" onPress={handleCheckout} disabled={cartItems.length === 0} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  barcodeScannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedDataContainer: {
    alignItems: 'center',
  },
  cartContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  checkoutButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});
