import React from 'react';
import { Searchbar as PaperSearchbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/styles';

const SearchBar = ({ placeholder, query, onChangeQuery }) => {
  return (
    <PaperSearchbar
      placeholder={placeholder || "Search..."}
      onChangeText={onChangeQuery}
      value={query}
      style={styles.searchBar}
      theme={{ colors: { primary: colors.primary } }}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default SearchBar;
