import React, { useState, useEffect } from "react";
import { FishCard, IFish } from "../../components/FishCard";
import { TopBar } from "../../components/TopBar";
import { GetWikiFishes } from "../../services/wikiServices/getWikiFishes";
import {
    PageContainer,
    IconFilter,
    SearchBarContainer,
    RowContainer,
    TouchableFilter,
    TextFilter,
    TitleContainer,
    TouchableTitle,
    TitleText,
    TitleHighlight,
    NoResultContainer,
    BoldText,
    RegularText,
    SearchImage,
    FishCardList,
    FishBodyContainer
} from "./styles";


export const Wiki = ({ navigation, route }: any) => {

    const {
        filterQuery,
        fishMaxSize,
        fishMinSize,
        fishMaxWeight,
        fishMinWeight
    } = route.params;

    console.log(filterQuery);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [wiki, setWiki] = useState(false);
    const [filter, setFilter] = useState(false);
    const [fishes, setFishes] = useState<IFish[]>([]);

    const updateFishes = async () => {
        try {
            const data = await GetWikiFishes(filterQuery);
            setFishes(data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const checkSizes = (maxSize: number, minSize: number, fishSize: number) => {
        if (maxSize && minSize) {
            if (fishSize >= minSize && fishSize <= maxSize) {
                return true;
            }
            return false;
        } else if (minSize) {
            if (fishSize >= minSize) {
                return true;
            }
            return false;
        } else if (maxSize) {
            if (fishSize <= maxSize) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    };

    const checkWeights = (maxWeight: number, minWeight: number, fishWeight: number) => {
        if (maxWeight && minWeight) {
            if (fishWeight >= minWeight && fishWeight <= maxWeight) {
                return true;
            }
            return false;
        } else if (minWeight) {
            if (fishWeight >= minWeight) {
                return true;
            }
            return false;
        } else if (maxWeight) {
            if (fishWeight <= maxWeight) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    };

    useEffect(() => {
        updateFishes();
    }, [])

    return (
        <PageContainer>
            <TopBar title='Biblioteca' />
            <FishBodyContainer>
                <TitleContainer>
                    <TouchableTitle onPress={() => { setWiki(false) }}>
                        <TitleText wiki={wiki}>Biblioteca de Peixes</TitleText>
                        {
                            wiki ? null : <TitleHighlight />
                        }
                    </TouchableTitle>
                    <TouchableTitle onPress={() => { setWiki(true) }}>
                        <TitleText wiki={!wiki}>Registros</TitleText>
                        {
                            wiki ? <TitleHighlight /> : null
                        }
                    </TouchableTitle>
                </TitleContainer>
                <RowContainer>
                    <SearchBarContainer
                        placeholder="Pesquisar"
                        placeholderTextColor="rgba(32, 46, 53, 0.3)"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        iconColor="#202E35"
                    />
                    <TouchableFilter onPress={() => navigation.navigate('WikiFilter')}>
                        <TextFilter filter={filter}>Filtro</TextFilter>
                    </TouchableFilter>
                    <IconFilter name="filter-list" />
                </RowContainer>
                {
                    fishes.filter((fish) => {
                        if (!searchQuery ||
                            fish.commonName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                            fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase().trim())
                        ) {
                            return fish;
                        }
                    }).filter((item) => {
                        if (checkSizes(fishMaxSize, fishMinSize, item.maxSize)) {
                            return item;
                        }
                    }).filter((item) => {
                        if (checkWeights(fishMaxWeight, fishMinWeight, item.maxWeight)) {
                            return item;
                        }
                    }).length ? (
                        <FishCardList
                            data={fishes.filter((item) => {
                                if (!searchQuery ||
                                    item.commonName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                                    item.scientificName.toLowerCase().includes(searchQuery.toLowerCase().trim())
                                ) {
                                    return item;
                                }
                            }).filter((item) => {
                                if (checkSizes(fishMaxSize, fishMinSize, item.maxSize)) {
                                    return item;
                                }
                            }).filter((item) => {
                                if (checkWeights(fishMaxWeight, fishMinWeight, item.maxWeight)) {
                                    return item;
                                }
                            })}
                            renderItem={({ item }) => <FishCard fish={item} />}
                            keyExtractor={item => item._id}
                        />
                    ) : (
                        <NoResultContainer>
                            <SearchImage source={require('../../assets/search.png')} />
                            <BoldText>Não encontramos nada com o termo digitado</BoldText>
                            <RegularText>Por favor, verifique sua pesquisa e tente novamente para obter resultados.</RegularText>
                        </NoResultContainer>
                    )
                }
            </FishBodyContainer>
        </PageContainer>
    )
}