import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { colors } from '../styles/styles';

const RecordCard = ({ title, subtitle, details, photos = [], warnings = [], backgroundColor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, { backgroundColor: backgroundColor || '#fff' }]}>
        <Card.Title
          title={title}
          subtitle={subtitle}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content>
          {details.map((detail, index) => (
            <Text key={index} style={styles.detailsText}>{detail}</Text>
          ))}
          {warnings.length > 0 && (
            <View style={styles.warningContainer}>
              {warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>{warning}</Text>
              ))}
            </View>
          )}
          <View style={styles.photoContainer}>
            {photos.map((photoUri, index) => (
              <Image key={index} source={{ uri: photoUri }} style={styles.photo} />
            ))}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  warningContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFC7C7',
    borderRadius: 5,
  },
  warningText: {
    color: '#B00020',
    fontSize: 14,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photo: {
    width: 95,
    height: 95,
    margin: 5,
    borderRadius: 5,
  },
});

export default RecordCard;
