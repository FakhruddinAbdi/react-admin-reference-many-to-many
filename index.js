import React, { useState, useEffect } from 'react';
import { useDataProvider, Loading, Error, SelectArrayInput } from 'react-admin';

const ReferenceManyToManyInput = ({ record = {}, source, reference, through, using, ...rest }) => {
    const dataProvider = useDataProvider();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        dataProvider.getManyReference(through, { target: using, id: record.id })
            .then(({ data }) => {
                const optionIds = data.map(item => item.id);
                return dataProvider.getMany(reference, { ids: optionIds });
            })
            .then(({ data }) => {
                setOptions(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [dataProvider, record.id, through, using, reference]);

    if (loading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
        <SelectArrayInput source={source} choices={options} {...rest} />
    );
};

export default ReferenceManyToManyInput;
