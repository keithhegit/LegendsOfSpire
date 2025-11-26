try {
    import('./src/data/cards.js').then(() => {
        console.log('Success');
    }).catch(err => {
        console.error(err);
    });
} catch (e) {
    console.error(e);
}
