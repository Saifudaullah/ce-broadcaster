class ApiJobController {

    static index(req, res) {
        return res.json({ job: { name: 'sample' } })
    }
}

export default ApiJobController;