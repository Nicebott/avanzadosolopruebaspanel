import { collection, query, where, getDocs, collectionGroup, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

export const updateUserNameInReviewsAndForums = async (userId: string, newName: string): Promise<void> => {
  try {
    const reviewsRef = collection(firestore, 'reviews');
    const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
    const reviewsSnapshot = await getDocs(reviewsQuery);

    const reviewUpdatePromises = reviewsSnapshot.docs.map(reviewDoc =>
      updateDoc(doc(firestore, 'reviews', reviewDoc.id), {
        userName: newName
      })
    );

    const messageUpdatePromises: Promise<void>[] = [];

    try {
      const messagesQuery = query(
        collectionGroup(firestore, 'mensajes'),
        where('autor', '==', userId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      messageUpdatePromises.push(
        ...messagesSnapshot.docs.map(messageDoc =>
          updateDoc(messageDoc.ref, {
            autorNombre: newName
          })
        )
      );
    } catch (indexError) {
      console.warn('Collection group query failed, using fallback method for messages');

      const forosRef = collection(firestore, 'foros');
      const forosSnapshot = await getDocs(forosRef);

      for (const foroDoc of forosSnapshot.docs) {
        const mensajesRef = collection(firestore, `foros/${foroDoc.id}/mensajes`);
        const mensajesQuery = query(mensajesRef, where('autor', '==', userId));
        const mensajesSnapshot = await getDocs(mensajesQuery);

        messageUpdatePromises.push(
          ...mensajesSnapshot.docs.map(messageDoc =>
            updateDoc(messageDoc.ref, {
              autorNombre: newName
            })
          )
        );
      }
    }

    const forosRef = collection(firestore, 'foros');
    const forosQuery = query(forosRef, where('creador', '==', userId));
    const forosSnapshot = await getDocs(forosQuery);

    const foroUpdatePromises = forosSnapshot.docs.map(foroDoc =>
      updateDoc(doc(firestore, 'foros', foroDoc.id), {
        creadorNombre: newName
      })
    );

    await Promise.all([
      ...reviewUpdatePromises,
      ...messageUpdatePromises,
      ...foroUpdatePromises
    ]);

    console.log('Successfully updated user name across all collections');
  } catch (error) {
    console.error('Error updating user name in reviews and forums:', error);
    throw error;
  }
};
