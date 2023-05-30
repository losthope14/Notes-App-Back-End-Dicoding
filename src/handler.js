// Handler untuk menambahkan notes
// install nanoid untuk membuat id yang unik
// npm install nanoid@3.x.x

const { nanoid } = require('nanoid');
const notes = require('./notes');

// menambahkan note
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  // membuat properti notes
  const id = nanoid(16); // properti id
  const createdAt = new Date().toISOString(); // properti createdAt
  const updatedAt = createdAt; // untuk kasus tambah notes, properti updatedAt sama dengan createdAt

  // buat objek note baru
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote); // tambahkan new note ke dalam array notes file notes.js

  // mengecek apakah new note berhasil ditambahkan
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    // response jika new note berhasil ditambahkan
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201); // menentukan status code 201: created
    return response;
  }

  // response jika new note gagal ditambahkan
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan semua notes
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// menampilkan note secara spesifik atau menampilkan isi dari note tertentu
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// untuk mengedit note
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params; // ambil id note dari query parameter

  const { title, tags, body } = request.payload; // ambil data baru
  const updatedAt = new Date().toISOString(); // ubah nilai properti update

  const index = notes.findIndex((note) => note.id === id); // temukan note yang lama menggunakan id

  // jika note ditemukan, variabel index akan bernilai array index dari note tersebut
  // jika tidak, variabel index bernilai -1
  if (index !== -1) {
    notes[index] = {
      ...notes[index], // pertahankan nilai notes[index] yang tidak perlu diubah
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // response jika note yang dicari tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// untuk menghapus note
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params; // ambil id note dari parameter query

  const index = notes.findIndex((note) => note.id === id); // temukan note yang ingin dihapus

  if (index !== -1) {
    notes.splice(index, 1); // hapus note pada indeks ke index
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
